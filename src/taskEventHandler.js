
const { ipcMain } = require('electron')
const selenium_open = require('./selenium');
const fs = require('fs');

module.exports = function(app) {

    ipcMain.handle('activate-task', (e, task) => {
        selenium_open(task);
    })

    ipcMain.handle('delete-cookies', (e, task) => {
        fs.unlinkSync('./cookies.json');
        app.relaunch();
        app.exit();
    })

}