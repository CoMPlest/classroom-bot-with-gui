
const { ipcMain } = require('electron')
const selenium_open = require('./selenium');

module.exports = function(app) {

    ipcMain.handle('activate-task', (e, task) => {
        selenium_open(task);
    })

}