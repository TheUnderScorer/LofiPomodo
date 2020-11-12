const electron = require('electron');

window.ipcRenderer = electron.ipcRenderer;
window.platform = process.platform;
