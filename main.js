const { app, BrowserWindow, nativeTheme, Tray, Menu  } = require('electron');
const fs = require("fs");

const cookiesPath = "./cookies.json";
//let tray = null;

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })
  nativeTheme.themeSouce = 'dark';
  win.setMenu(null);
  win.loadFile('./src/index.html');
}

app.whenReady().then(() => {
  require('./src/updater')();
  // tray = new Tray()
  // const contextMenu = Menu.buildFromTemplate([
  //   { label: 'Item1', type: 'radio' },
  //   { label: 'Item2', type: 'radio' },
  //   { label: 'Item3', type: 'radio', checked: true },
  //   { label: 'Item4', type: 'radio' }
  // ])
  // tray.setToolTip('This is my application.')
  // tray.setContextMenu(contextMenu)

  try {
    if (!fs.existsSync(cookiesPath) || JSON.parse(fs.readFileSync(cookiesPath)).filter(obj => { return obj.name === 'SIDCC' })[0].expiry > Date.now()) {
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


