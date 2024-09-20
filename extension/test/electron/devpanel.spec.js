import { join } from 'path';
import webdriver from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import electronPath from 'electron';
import chromedriver from 'chromedriver';
import { switchMonitorTests, delay } from '../utils/e2e';

const devPanelPath =
  'chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljd/devpanel.html';

describe('DevTools panel for Electron', function () {
  let driver;

  beforeAll(async () => {
    chromedriver.start();
    await delay(1000);
    driver = new webdriver.Builder()
      .usingServer('http://localhost:9515')
      .setChromeOptions(
        new chrome.Options()
          .setChromeBinaryPath(electronPath)
          .addArguments(`app=${join(__dirname, 'fixture')}`),
      )
      .forBrowser('chrome')
      .build();
  });

  afterAll(async () => {
    await driver.quit();
    chromedriver.stop();
  });

  it('should open Redux DevTools tab', async () => {
    if (!(await driver.getCurrentUrl()).startsWith('devtools')) {
      const originalWindow = await driver.getWindowHandle();
      const windows = await driver.getAllWindowHandles();
      for (const window of windows) {
        if (window === originalWindow) continue;
        await driver.switchTo().window(window);
        if ((await driver.getCurrentUrl()).startsWith('devtools')) {
          break;
        }
      }
    }
    expect(await driver.getCurrentUrl()).toMatch(
      /devtools:\/\/devtools\/bundled\/devtools_app.html/,
    );

    const id = await driver.executeAsyncScript(function (callback) {
      let attempts = 5;
      function showReduxPanel() {
        if (attempts === 0) {
          return callback('Redux panel not found');
        }
        if (EUI.InspectorView) {
          const instance = EUI.InspectorView.InspectorView.instance();
          const tabs = instance.tabbedPane.tabs;
          const idList = tabs.map((tab) => tab.id);
          const reduxPanelId =
            'chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljdRedux';
          if (idList.indexOf(reduxPanelId) !== -1) {
            instance.showPanel(reduxPanelId);
            return callback(reduxPanelId);
          }
        }
        attempts--;
        setTimeout(showReduxPanel, 500);
      }
      showReduxPanel();
    });
    expect(id).toBe('chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljdRedux');

    const className = await driver
      .findElement(webdriver.By.className(id))
      .getAttribute('class');
    expect(className).not.toMatch(/hidden/); // not hidden
  });

  // eslint-disable-next-line jest/expect-expect
  it('should have Redux DevTools UI on current tab', async () => {
    await driver
      .switchTo()
      .frame(
        driver.findElement(
          webdriver.By.xpath(`//iframe[@src='${devPanelPath}']`),
        ),
      );
    await delay(1000);
  });

  it('should contain INIT action', async () => {
    const element = await driver.wait(
      webdriver.until.elementLocated(
        webdriver.By.xpath('//div[@data-testid="actionListRows"]'),
      ),
      5000,
      'Element not found',
    );
    const val = await element.getText();
    expect(val).toMatch(/@@INIT/);
  });

  it("should contain Inspector monitor's component", async () => {
    const val = await driver
      .findElement(webdriver.By.xpath('//div[@data-testid="inspector"]'))
      .getText();
    expect(val).toBeDefined();
  });

  Object.keys(switchMonitorTests).forEach((description) =>
    // eslint-disable-next-line jest/expect-expect,jest/valid-title
    it(description, () => switchMonitorTests[description](driver)),
  );

  // eslint-disable-next-line jest/no-commented-out-tests
  /*  it('should be no logs in console of main window', async () => {
    const handles = await driver.getAllWindowHandles();
    await driver.switchTo().window(handles[1]); // Change to main window

    expect(await driver.getTitle()).toBe('Electron Test');

    const logs = await driver.manage().logs().get(webdriver.logging.Type.BROWSER);
    expect(logs).toEqual([]);
  });
*/
});
