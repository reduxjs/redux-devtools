import { resolve } from 'path';
import webdriver from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { switchMonitorTests, delay } from '../utils/e2e';

const path = resolve(__dirname, '..', '..', 'dist');
const extensionId = 'lmhkpmbekcpmknklioeibfkpmmfibljd';
const actionsPattern =
  /^@@INIT(.|\n)+@@reduxReactRouter\/routerDidChange(.|\n)+@@reduxReactRouter\/initRoutes(.|\n)+$/;

describe('Chrome extension', function () {
  let driver;

  beforeAll(async () => {
    driver = new webdriver.Builder()
      .setChromeOptions(
        new chrome.Options()
          .setBrowserVersion('stable')
          .addArguments(`load-extension=${path}`),
      )
      .forBrowser('chrome')
      .build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  it("should open extension's window", async () => {
    await driver.get(`chrome-extension://${extensionId}/devpanel.html`);
    const url = await driver.getCurrentUrl();
    expect(url).toBe(`chrome-extension://${extensionId}/devpanel.html`);
  });

  it('should match document title', async () => {
    const title = await driver.getTitle();
    expect(title).toBe('Redux DevTools');
  });

  it('should get actions list', async () => {
    const url = 'https://zalmoxisus.github.io/examples/router/';
    await driver.executeScript(`window.open('${url}')`);
    await delay(2000);

    const tabs = await driver.getAllWindowHandles();

    await driver.switchTo().window(tabs[1]);
    expect(await driver.getCurrentUrl()).toMatch(url);

    await driver.switchTo().window(tabs[0]);

    await delay(1000);
    const result = await driver.wait(
      driver
        .findElement(webdriver.By.xpath('//div[@data-testid="actionListRows"]'))
        .getText()
        .then((val) => {
          return actionsPattern.test(val);
        }),
      15000,
      "it doesn't match actions pattern",
    );
    expect(result).toBeTruthy();
  });

  it("should contain inspector monitor's component", async () => {
    const val = await driver
      .findElement(webdriver.By.xpath('//div[@data-testid="inspector"]'))
      .getText();
    expect(val).toBeDefined();
  });

  Object.keys(switchMonitorTests).forEach((description) =>
    // eslint-disable-next-line jest/expect-expect,jest/valid-title
    it(description, () => switchMonitorTests[description](driver)),
  );
});
