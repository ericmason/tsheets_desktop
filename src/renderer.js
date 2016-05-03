var Status = {}

const ipcRenderer = require('electron').ipcRenderer;

var was_clocked_in = false;
var was_clocked_into = null;
var initial = true;

Status.isClockedIn = function() {
	const $job = jQuery('#timecard_jobcode_list div:first');
	if (!$job[0])
		return false;
	return $job.hasClass('timecard-jc-current-job');
};

Status.ready = function() {
	return jQuery('#timecard_jobcode_list div').length > 0;
}

Status.getCurrentJob = function() {
	const $job = jQuery('#timecard_jobcode_list div:first');
	if ($job[0] && $job.hasClass('timecard-jc-current-job'))
		return $job.text();
};

Status.getTopJobs = function() {
	const $jobs = jQuery('#timecard_jobcode_list div');
	var result = $jobs.toArray().slice(0,5).filter(function(el) {
		return $(el).attr('title') != 'Open folder';
	}).map(function(el) {
		return $(el).text().trim();
	});
	return result;
}

Status.updateClockedIn = function() {
	if (!Status.ready()) {
		return;
	}
	if (Status.isClockedIn()) {
		if (was_clocked_into != Status.getCurrentJob() || initial) {
			ipcRenderer.send('status', {
				status: 'clocked_in',
				currentJob: Status.getCurrentJob(),
				topJobs: Status.getTopJobs()
			});
		}
		was_clocked_in = true;
		was_clocked_into = Status.getCurrentJob();
	} else {
		if (was_clocked_in || initial) {
			ipcRenderer.send('status', {
				status: 'clocked_out', 
				topJobs: Status.getTopJobs()
			});
		}
		was_clocked_in = false;
		was_clocked_into = null;
		initial = false;
	}
};

Status.clockout = function() {
	if (Status.isClockedIn()) {
		jQuery('#timecard_jobcode_list div:first').click();
	};
}

Status.clockin = function(job_number) {
	if (job_number) {
		var div = jQuery('#timecard_jobcode_list div:eq(' + job_number + ')')
		div.click();
	} else {
		if (!Status.isClockedIn()) {
			jQuery('#timecard_jobcode_list div:first').click();
		}
	}
};

ipcRenderer.on('idle-clockout', function(event, arg) {
	Status.clockout();
});

ipcRenderer.on('clockout', function(event, arg) {
	Status.clockout();
});

ipcRenderer.on('clockin', function(event, arg) {
	Status.clockin(arg.job_number);
});

setInterval(function() {
	if ((typeof jQuery) !== 'undefined') {
		Status.updateClockedIn();
	}
}, 500);

module.exports = Status;