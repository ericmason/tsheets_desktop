var Status = {}

const ipcRenderer = require('electron').ipcRenderer;

var was_clocked_in = false;

Status.isClockedIn = function() {
	const $job = jQuery('#timecard_jobcode_list div:first');
	if (!$job[0])
		return false;
	return $job.hasClass('timecard-jc-current-job');
};

Status.updateClockedIn = function() {	
	if (Status.isClockedIn()) {
		if (!was_clocked_in) {
			ipcRenderer.send('status', 'clocked_in');
		}
		was_clocked_in = true;
	} else {
		if (was_clocked_in) {
			ipcRenderer.send('status', 'clocked_out');
		}
		was_clocked_in = false;
	}
};

Status.clockout = function() {
	if (Status.isClockedIn()) {
		jQuery('#timecard_jobcode_list div:first').click();
	};
}

ipcRenderer.on('idle-clockout', function(event, arg) {
	Status.clockout();
});

setInterval(function() {
	if ((typeof jQuery) !== 'undefined') {
		console.log('found jquery, updating stuff');
		Status.updateClockedIn();
	}
}, 500);

module.exports = Status;