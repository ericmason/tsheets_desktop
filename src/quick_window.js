const electron = require('electron');
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

class QuickWindow {
	constructor(options = {}) {
		this.main_window = options.main_window;
		this.clocked_in = false;

		console.log('quick window started');
		var self = this;
		ipcMain.on('status', function(event, arg) {
			console.log('got status: ' + arg);
			if (arg == 'clocked_in') {
				self.clocked_in = true;
				self.openWindow();
			} else if (arg == 'clocked_out') {
				self.clocked_in = false;
				if (self.window) {
					self.window.close();
				}
			}
		});
	}

	openWindow() {
		var screen = electron.screen;
		var screen_size = screen.getPrimaryDisplay().workAreaSize;
		var width = 200,
			height = 50;
		console.log('screen size: ');
		console.log(screen_size);
		var x = screen_size.width - width,
			y = screen_size.height - height;
		this.window = new BrowserWindow({ width: width, height: height, x: x, y: y, titleBarStyle: 'hidden' });
		this.window.loadURL('quick_window.html');
	}
}

module.exports = QuickWindow;