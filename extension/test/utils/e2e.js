import webdriver from 'selenium-webdriver';

export const delay = time => new Promise(resolve => setTimeout(resolve, time));

export const switchMonitorTests = {
  'should switch to Log Monitor': async function() {
    await this.driver.findElement(webdriver.By.xpath('//div[text()="Inspector"]')).click();
    await delay(500); // Wait till menu is fully opened
    await this.driver.findElement(webdriver.By.xpath('//div[text()="Log monitor"]')).click();
    await delay(500);
    await this.driver.findElement(webdriver.By.xpath('//div[a[text()="Reset"] and .//a[text()="Revert"]]'));
    await delay(500);
  },

  'should switch to Chart Monitor': async function() {
    await this.driver.findElement(webdriver.By.xpath('//div[text()="Log monitor"]')).click();
    await delay(500); // Wait till menu is fully opened
    await this.driver.findElement(webdriver.By.xpath('//div[text()="Chart"]')).click();
    await delay(500);
    await this.driver.findElement(webdriver.By.xpath('//*[@class="nodeText" and text()="state"]'));
    await delay(500); // Wait till menu is closed
  },

  'should switch back to Inspector Monitor': async function() {
    await this.driver.findElement(webdriver.By.xpath('//div[text()="Chart"]')).click();
    await delay(1000); // Wait till menu is fully opened
    await this.driver.findElement(webdriver.By.xpath('//div[text()="Inspector"]')).click();
    await delay(1500); // Wait till menu is closed
  }
};
