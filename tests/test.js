const {By,Key,Builder} = require("selenium-webdriver");
var assert = require('assert');
require("chromedriver");

describe('Buy notebook tests', function() {
    const tests = [
        {count: 2, expected: "2 item(s) - $2,404.00"},
        {count: '2.0', expected: "2 item(s) - $2,404.00"},
        {count: 0, expected: "0 item(s) - $0.00"},
    ];

    tests.forEach(({count, expected}) => {
        it('Buys '+ count +' notebook/s', async function() {
            try {
                //To wait for browser to build and launch properly
                await driver.get("http://vsrvfeia0h-114.vsb.cz/opencart/");
                await driver.findElement(By.name('search')).sendKeys('macbook air');
                await driver.findElement(By.css('.btn.btn-default.btn-lg')).click();
                await driver.findElement(By.partialLinkText('MacBook Air')).click();
                await driver.findElement(By.id('input-quantity')).clear();
                await driver.findElement(By.id('input-quantity')).sendKeys(count);
                await driver.findElement(By.id('button-cart')).click();

                await driver.findElement(By.id('logo')).findElement(By.css('a')).click();
                let elementText = await getText(driver, 'cart-total');

                assert.equal(expected, elementText);
            }  catch (err) {
                handleFailure(err, driver)
            }
        })
    })

    beforeEach(async function() {
        driver = await new Builder().forBrowser("chrome").build();
    });

    afterEach(async function() {
        await driver.quit();
    });
})


function handleFailure(err, driver) {
    console.error('Something went wrong!\n', err.stack, '\n');
    driver.quit();
}

async function getText(driver, id) {
    const el = await driver.findElement(By.id(id));
    return el.getText();
}