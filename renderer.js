var Status = {}

const ipcRenderer = require('electron').ipcRenderer;
const remote = require('remote');
const idle = remote.require('system-idle-time');
const dialog = remote.dialog;

var was_clocked_in = false;

Status.isClockedIn = function() {
	const $job = $('#timecard_jobcode_list div:first');
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
		$('#timecard_jobcode_list div:first').click();
		remote.app.dock.bounce('critical');
		const win = remote.getCurrentWindow();
		setTimeout(function() {
			dialog.showMessageBox(null, {type: "info", title: "You have been clocked out.", message: "Since you were idle, we automatically clocked you out.", buttons: ["Ok"]});	
		}, 1000)
		
	};
}

Status.clockoutOnIdle = function() {
  max_idle_time = 5;
  if (idle.getIdleTime() > max_idle_time) {
    Status.clockout();   
  }
}

setInterval(function() {
	Status.updateClockedIn();
	Status.clockoutOnIdle();
}, 5 * 60);

module.exports = Status;