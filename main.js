const { app, BrowserWindow, nativeTheme  } = require('electron');
const fs = require("fs");

const cookiesPath = "./cookies.json";

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })
  nativeTheme.themeSouce = 'dark';
  //win.setMenu(null);
  win.loadFile('./src/index.html');
}

app.whenReady().then(() => {
  try {
    if (!fs.existsSync(cookiesPath) || JSON.parse(fs.readFileSync(cookiesPath))[1].expiry > Date.now()) {
      require('./src/login')(app);
    } else {
      require('./src/taskEventHandler')(app);
      createWindow();
    }
  } catch (err) {
    console.error(err);
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


