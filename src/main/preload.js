const electron = require('electron');

window.ipcRenderer = electron.ipcRenderer;

console.log(process.env.NODE_ENV);

window.electronRequire = require;
