'use strict';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const fs = require('fs');
const ipcMain = electron.ipcMain;
const path = require('path');
const Tsheets = require(path.resolve(path.join(__dirname, 'tsheets.js')));
const ElectronSettings = require('electron-settings');
const QuickWindow = require(path.resolve(path.join(__dirname, 'quick_window.js')));
const TSheetsMenu = require(path.resolve(path.join(__dirname, 'menu.js')));
let settings = new ElectronSettings();


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.clockout_quit();
  }
});


// app.dock.setIcon(app.getAppPath() + "/images/play.png");

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800, 
    height: 600,
    webPreferences: {
      preload: path.resolve(path.join(__dirname, 'renderer.js')),
      nodeIntegration: false,
      webSecurity: true
    }
  });


  // Menu
  var menu = new TSheetsMenu();

  // and load the index.html of the app.
  // mainWindow.loadURL('https://equisolve.tsheets.com/');


  var url;
  if (url = settings.get('company-url')) {
    mainWindow.loadURL(url);
  } else {
    mainWindow.loadURL('https://www.tsheets.com/signin');
    mainWindow.webContents.on('did-navigate', function(event, url) {
      if (url.match(/https:\/\/[\w-]+\.tsheets\.com/)) {
        settings.set('company-url', url);
      }
    });
  }
  
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();


  const tsheets = new Tsheets(mainWindow);

  app.clockout = function() {
    tsheets.clockout();
  };

  app.clockout_quit = function() {
    tsheets.clockout(function() {
      app.quit();
    });

    // Quit after a second regardless
    setTimeout(function() {
      tsheets.clocked_out = true;
      app.quit()
    }, 1000);
  }

  //const quick_window = new QuickWindow({main_window: mainWindow});

  mainWindow.on('close', function(e) {
    if (!tsheets.clocked_out) {
      app.clockout_quit();
      e.preventDefault();
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
