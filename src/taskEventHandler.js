
const { ipcMain, dialog } = require('electron')
const selenium_open = require('./selenium');
const fs = require('fs');
const os = require("os");

module.exports = function(app) {

    ipcMain.handle('activate-task', (e, task) => {
        selenium_open(task);
    })

    ipcMain.handle('delete-cookies', (e, task) => {
        fs.unlinkSync('./cookies.json');
        app.relaunch();
        app.exit();
    })

    ipcMain.handle('save-queue', async (e, tasks) => {
        const res = await dialog.showSaveDialog({
            title: "Save file - schedule",
            defaultPath : "C:\\Users\\" + os.userInfo().username + "\\Documents\\schedule.json",
            filters :[
                {name: 'Json Files', extensions: ['json']},
                {name: 'Custom File Type', extensions: ['as']},
                {name: 'All Files', extensions: ['*']}
            ],
        })
        if (!res.canceled) {
            fs.writeFileSync(res.filePath, JSON.stringify(tasks));
        }
    });

    ipcMain.on('import-queue', async (e, tasks) => {
        const res = await dialog.showOpenDialog({
            title: "Open file - schedule",
            properties: ['openFile'],
            filters :[
                {name: 'Json Files', extensions: ['json']},
                {name: 'All Files', extensions: ['*']}
            ],
        })
        if (!res.canceled) {
            fileContent = fs.readFileSync(res.filePaths[0]);
            e.reply('import-queue', JSON.parse(fileContent));
        }
    });

}