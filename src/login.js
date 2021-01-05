const { BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const {Builder} = require('selenium-webdriver');
const chrome = require("selenium-webdriver/chrome");

const prefs = {
  "profile.default_content_setting_values.media_stream_mic": 1,
  "profile.default_content_setting_values.media_stream_camera": 1,
  "profile.default_content_setting_values.notifications": 1,
};
const cookiesPath = "../cookies.json";
const ClassroomUrl = "https://classroom.google.com/u/0/h";

const chrome_options = new chrome.Options();
chrome_options.setUserPreferences(prefs);

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
    
  });
  win.setMenu(null);
  win.loadFile("./src/login.html");
}

module.exports = async function executeLogin(app) {
  createWindow();

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(chrome_options)
    .build(); 
  await driver.get(ClassroomUrl);
  ipcMain.handle("loginDone", async (args) => {
    const cookies = await driver.manage().getCookies();
    if (cookies !== {}) {
        //console.log(cookies);
        fs.writeFileSync("./cookies.json", JSON.stringify(cookies));
        await driver.close();
        app.relaunch();
        app.exit();
    }
  });
};
