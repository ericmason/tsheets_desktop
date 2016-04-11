'use strict';

const electron = require('electron');
const idle = require('system-idle-time');
const dialog = electron.dialog;
const ipcMain = electron.ipcMain;
const app = electron.app;

class Tsheets {
	clockoutOnIdle() {
		const max_idle_time = 5 * 60; // seconds

		if (idle.getIdleTime() > max_idle_time && !this.clocked_out) {
			this.window.webContents.send('idle-clockout', '');
			this.clocked_out = true;
			electron.app.dock.bounce('critical');
			setTimeout(function() {
				dialog.showMessageBox(null, {
					type: "info", 
					title: "You have been clocked out.", 
					message: "Since you were idle, we automatically clocked you out.", 
					buttons: ["Ok"]
				});	
			}, 1000);
		}
	}

	constructor(window) {
		this.window = window;
		this.clocked_out = false;

		const self = this;
		setInterval(function() {self.clockoutOnIdle()}, 500);

		ipcMain.on('status', function(event, arg) {
			if (arg == "clocked_in") {
				self.clocked_out = false;
				app.dock.setIcon(app.getAppPath() + "/images/tsheets-play.png");
			} else if (arg == "clocked_out") {
				app.dock.setIcon(app.getAppPath() + "/images/tsheets.png");
				self.clocked_out = true;
			}
		});
	}
}

module.exports = Tsheets;