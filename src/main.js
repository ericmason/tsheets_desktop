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
const Menu = electron.Menu;
const Tray = electron.Tray;
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
  
  const tsheets = new Tsheets(mainWindow);

  // Tray
  const clocked_out_image = path.join(__dirname, 'images/tsheets-menubar.png');
  const clocked_in_image = path.join(__dirname, 'images/tsheets-play-menubar.png');
  app.tray = new Tray(clocked_out_image);
  app.tray.setClockedOut = function(top_jobs) {
    app.tray.setImage(clocked_out_image);
    app.tray.setTitle('');
    app.tray.setTopJobs(top_jobs, false);
  };
  app.tray.setClockedIn = function(title, top_jobs) {
    app.tray.setImage(clocked_in_image);
    app.tray.setTitle(title);
    app.tray.setTopJobs(top_jobs, true);
  };
  app.tray.setTopJobs = function(jobs, clocked_in) {
    if (!jobs) {
      app.tray.setContextMenu(null);
      return;
    }
    var menu_items = jobs.map(function(job, i) {
      return {
        label: job,
        click: function() {
          tsheets.clockin(i);
        }
      }
    });
    if (clocked_in)
      menu_items.push({label: 'Clock Out', click: function() { tsheets.clockout() } })
    menu_items.push({label: '--'});
    menu_items.push({label: 'TSheets', click: function() { mainWindow.focus() } });
    menu_items.push({label: 'Quit', click: function() { app.clockout_quit() } });
    var contextMenu = Menu.buildFromTemplate(menu_items);
    app.tray.setContextMenu(contextMenu);
  };

  // Menu
  var menu = new TSheetsMenu();

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
  // mainWindow.webContents.openDevTools();

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
