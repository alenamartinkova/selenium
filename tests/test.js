const {By,Key,Builder} = require("selenium-webdriver");
var assert = require('assert');
require("chromedriver");
/*
describe('Buy notebook tests', function() {
    const tests = [
        {count: '1', expected: "1 item(s) - $1,202.00"},
        {count: '0', expected: "0 item(s) - $0.00"},
        {count: '-1', expected: "0 item(s) - $0.00"},
        {count: '-99', expected: "0 item(s) - $0.00"},
        {count: '2147483647', expected: "2147483647 item(s) - $2,581,275,343,694.00"},
        {count: '2147483648', expected: "2147483647 item(s) - $2,581,275,343,694.00"},
    ];

    tests.forEach(({count, expected}) => {
        it('Buys '+ count +' notebook/s', async function() {
            try {
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

        //To wait for browser to build and launch properly
        await driver.get("http://vsrvfeia0h-114.vsb.cz/opencart/");
    });

    afterEach(async function() {
        await driver.quit();
    });
})
*/
describe('Login tests', function() {
    const tests = [
        {email: 'test2022@test.test', password: "test123"},
        {email: 'test2022@test.test', password: "test123"},
    ];

    tests.forEach(({email, password}) => {
        it('Login email: '+ email +', password: ' + password, async function() {
            let driver = await new Builder().forBrowser("chrome").build();
            //To wait for browser to build and launch properly
            
            try {
                await driver.get("http://vsrvfeia0h-114.vsb.cz/opencart/");
                await driver.findElement(By.id('top-links')).findElement(By.css('.dropdown .dropdown-toggle')).click();
                await driver.findElement(By.css('.dropdown-menu.dropdown-menu-right')).findElement(By.linkText('Login')).click();
                await driver.findElement(By.id('input-email')).sendKeys(email);
                await driver.findElement(By.id('input-password')).sendKeys(password);
                await driver.findElement(By.css('input[type="submit"]')).click();

                //assert.equal("http://vsrvfeia0h-114.vsb.cz/opencart/index.php?route=account/account", url);
                await driver.quit();
            }  catch (err) {
                handleFailure(err, driver)
            }
        })
    })

    /*beforeEach(async function() {
        driver = await new Builder().forBrowser("chrome").build();
        //To wait for browser to build and launch properly
        await driver.get("http://vsrvfeia0h-114.vsb.cz/opencart/");
    });

    afterEach(async function() {
        await driver.quit();
    });*/
})


function handleFailure(err, driver) {
    console.error('Something went wrong!\n', err.stack, '\n');
    driver.quit();
}

async function getText(driver, id) {
    const el = await driver.findElement(By.id(id));
    return el.getText();
}