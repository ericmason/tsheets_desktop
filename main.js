'use strict';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const fs = require('fs');
const ipcMain = electron.ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});


// app.dock.setIcon(app.getAppPath() + "/images/play.png");

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL('https://equisolve.tsheets.com/');


  
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Idle warning
  // const dialog = require('electron').dialog;
  // dialog.showMessageBox(mainWindow, {type: "question", buttons: ["Yes", "No"], title: "You are idle.", message: "Do you want to log out?"});
  var code = fs.readFileSync(app.getAppPath() + "/renderer.js");
  mainWindow.webContents.executeJavaScript(`try { ${code} } catch (e) { console.log("ERROR:"); console.log(e); }`);
  
  ipcMain.on('status', function(event, arg) {
    if (arg == "clocked_in") {
      app.dock.setIcon(app.getAppPath() + "/images/stop.png");
    } else if (arg == "clocked_out") {
      app.dock.setIcon(app.getAppPath() + "/images/play.png");
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    app.quit();
  });
});


function say(message) {
  require('electron').dialog.showMessageBox(null, {type: "info", buttons: ["Ok"], title: "Message", message: message});
}
