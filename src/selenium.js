const chrome = require("selenium-webdriver/chrome");
const {Builder, By} = require('selenium-webdriver');
const fs = require("fs");

const prefs = {
  "profile.default_content_setting_values.media_stream_mic": 1,
  "profile.default_content_setting_values.media_stream_camera": 1,
  "profile.default_content_setting_values.notifications": 1,
};
const cookiesPath = "./cookies.json";
const ClassroomUrl = "https://classroom.google.com/u/0/h";

const chrome_options = new chrome.Options();
chrome_options.setUserPreferences(prefs);

module.exports = async function selenium_open(task) {
  const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(chrome_options)
      .build();

  try {
    await driver.get(ClassroomUrl);
    await waitForPageLoad(driver);

    const cookies = JSON.parse(fs.readFileSync(cookiesPath));
    for await (let cookie of cookies) {
      await driver.manage().addCookie(cookie);
    }

    if (task.typeSelect === 1) {
      await getClassroomLink(task.classIdentifier, driver);
    } else if(task.typeSelect === 2) {
      await driver.get(task.classIdentifier);
    } else if(task.typeSelect === 3) {
      await getMeetCode(task.classIdentifier, driver);
    } else {
      return;
    }

    
    await waitForPageLoad(driver);
    await sleep(1);
    try {
      await (
        await driver.findElement(
          By.xpath("//*[@data-tooltip='Turn off microphone (ctrl + d)']")
        )
      ).click();
    } catch (err) {
      try {
        await (
          await driver.findElement(
            By.xpath("//*[@data-tooltip='Mikrofon kikapcsolása (ctrl + d)']")
          )
        ).click();
      } catch (err) {
        console.log("Could not find the microphone button");
      }
    }
    try {
      await (
        await driver.findElement(
          By.xpath("//*[@data-tooltip='Turn off camera (ctrl + e)']")
        )
      ).click();
    } catch (err) {
      try {
        await (
          await driver.findElement(
            By.xpath("//*[@data-tooltip='Kamera kikapcsolása (ctrl + e)']")
          )
        ).click();
      } catch (err) {
        console.log("Could not find the camera button");
      }
    }
    
    await sleep(2);
    try {
      await (
        await driver.findElement(By.xpath('//*[text()="Join now"]'))
      ).click();
    } catch (err) {
      try {
        await (
          await driver.findElement(By.xpath('//*[text()="Belépés"]'))
        ).click();
      } catch (err) {
        console.log("Could not find the join button");
      }
    }
  } catch (err) {
    console.log(err.message);
  }
  await sleep(task.taskInterval*60);
  await driver.close();
};

async function getClassroomLink(classroom_meet_name, driver) {
  await driver.get(ClassroomUrl);
  await waitForPageLoad(driver);
  await sleep(5);
  await (
    await driver.findElement(
      By.xpath('//div[text()="' + classroom_meet_name + '"]')
    )
  ).click();
  await waitForPageLoad(driver);
  await sleep(3);

  let classroom_regex = /(https:\/\/meet\.google\.com\/lookup\/.*\?authuser)/g;
  await driver.get((await driver.getPageSource()).match(classroom_regex)[0]);
}

async function getMeetCode(classroom_identifier, driver) {
  await driver.get('https://meet.google.com/landing');
  await waitForPageLoad(driver);

  try {
    await (
      await driver.findElement(
        By.xpath('//div[text()="' + 'Join or start a meeting' + '"]')
      )
    ).click();
  } catch (err) {
    try {
      await (
        await driver.findElement(
          By.xpath('//div[text()="' + 'Csatlakozás megbeszéléshez vagy új indítása' + '"]')
        )
      ).click();
    } catch (err) {
      console.log("Could not find join button");
    }
  }
  await sleep(1);
  try {
    await driver.findElement(
      By.xpath('//input[@data-keyboard-title="Use a meeting code"]')
    ).sendKeys(classroom_identifier + "\n");
  } catch (err) {
    try {
      await driver.findElement(
        By.xpath('//input[@data-keyboard-title="Kód használata"]')
      ).sendKeys(classroom_identifier + "\n");
    } catch (err) {
      console.log("Could not the code input field");
    }
  }
}

async function waitForPageLoad(driver) {
  driver.wait(function() {
    return driver.executeScript('return document.readyState').then(function(readyState) {
      return readyState === 'complete';
    });
  });
}

function sleep(s) {
  return new Promise((resolve) => {
      setTimeout(resolve, s*1000);
  });
} 