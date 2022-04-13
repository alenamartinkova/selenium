const {By,Key,Builder} = require("selenium-webdriver");
var assert = require('assert');
require("chromedriver");

describe('Buy notebook tests', function() {
    const tests = [
        // correct values
        {count: '1', expected: "1 item(s) - $1,202.00"},
        {count: '0', expected: "0 item(s) - $0.00"},
        // incorrect values
        {count: '-1', expected: "0 item(s) - $0.00"},
        {count: '-99', expected: "0 item(s) - $0.00"},
        // correct value
        {count: '2147483647', expected: "2147483647 item(s) - $2,581,275,343,694.00"},
        // incorrect value (boundary - will add 2147483647)
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

describe('Login tests', function() {
    const tests = [
        // correct
        {email: 'test2022@test.test', password: "test123"},
        // not correct
        {email: ' test2022@test.test', password: "test123"},
        // correct email, wrong pass
        {email: 'test2023@test.test', password: "wrongpassword"},
        // wrong email
        {email: 'notexistingemail@test.test', password: "test1234"},
        // wrong email, wrong pass
        {email: 'notexistingemail@test.test', password: "wrongpassword"},
    ];

    tests.forEach(({email, password}) => {
        it('Login email: '+ email +', password: ' + password, async function() {
            try {
                await driver.findElement(By.id('top-links')).findElement(By.css('.dropdown .dropdown-toggle')).click();
                await driver.findElement(By.css('.dropdown-menu.dropdown-menu-right')).findElement(By.linkText('Login')).click();
                await driver.findElement(By.id('input-email')).sendKeys(email);
                await driver.findElement(By.id('input-password')).sendKeys(password);
                await driver.findElement(By.css('input[type="submit"]')).click();

                try {
                    // element is displayed - login success
                    let accountProfileDisplayed = await driver.findElement(By.id('account-account')).isDisplayed();
                    assert.equal(true, accountProfileDisplayed);
                } catch (err) {
                    // login fail
                    let selector = '.alert.alert-danger.alert-dismissible';
                    let errorMessageDisplayed = await driver.findElement(By.css(selector)).isDisplayed();
                    assert.equal(true, errorMessageDisplayed);
                }
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

describe('Register tests', function() {
    const tests = [
        // all correct
        {name: 'test', lastname: 'test', email: 'test2022_2@test.test', password: "test123", password_confirm: 'test123', phone: '123456789', privacy: true},
        // privacy not checked
        {name: 'test', lastname: 'test', email: 'test2022_3@test.test', password: 'test123', password_confirm: 'test123', phone: '123456789', privacy: false},
        // shot first name
        {name: '', lastname: 'test', email: 'test2022_3@test.test', password: 'test123', password_confirm: 'test123', phone: '123456789', privacy: true},
        // long first name
        {name: 'abcdefghijklmnopqrstuvwxyzabcdeff', lastname: 'test', email: 'test2022_3@test.test', password: 'test123', password_confirm: 'test123', phone: '123456789', privacy: true},
        // long last name
        {name: '', lastname: 'abcdefghijklmnopqrstuvwxyzabcdeff', email: 'test2022_3@test.test', password: 'test123', password_confirm: 'test123', phone: '123456789', privacy: true},
        // short last name
        {name: '', lastname: '', email: 'test2022_3@test.test', password: 'test123', password_confirm: 'test123', phone: '123456789', privacy: true},
        // wrong email
        {name: '', lastname: '', email: '', password: 'test123', password_confirm: 'test123', phone: '123456789', privacy: true},
        // short password
        {name: '', lastname: '', email: '', password: '', password_confirm: 'test123', phone: '123456789', privacy: true},
        // long password
        {name: '', lastname: '', email: '', password: 'abcdefghijklmnopqrstuv', password_confirm: '', phone: '', privacy: true},
        // short phone
        {name: '', lastname: '', email: '', password: '', password_confirm: 'test123', phone: '', privacy: true},
        // long phone
        {name: '', lastname: '', email: '', password: '', password_confirm: 'test123', phone: 'abcdefghijklmnopqrstuvwxyzabcdeff', privacy: true},
        // not matching password
        {name: 'test', lastname: 'test', email: 'test@test.test', password: "test123", password_confirm: 'test1234', phone: '123456789', privacy: true},
        {name: '', lastname: '', email: '', password: '', password_confirm: 'test123', phone: '12', privacy: true},
    ];

    tests.forEach(({name, lastname, email, password, password_confirm, phone, privacy}) => {
        it('Register email: '+ email +', password: ' + password + ', password_confirm: '+ password_confirm + ', name: ' + name + ', lastname: ' + lastname + ', phone: ' + phone + ', privacy: ' + privacy, async function() {
            try {
                await driver.findElement(By.id('top-links')).findElement(By.css('.dropdown .dropdown-toggle')).click();
                await driver.findElement(By.css('.dropdown-menu.dropdown-menu-right')).findElement(By.linkText('Register')).click();
                await driver.findElement(By.id('input-firstname')).sendKeys(name);
                await driver.findElement(By.id('input-lastname')).sendKeys(lastname);
                await driver.findElement(By.id('input-email')).sendKeys(email);
                await driver.findElement(By.id('input-password')).sendKeys(password);
                await driver.findElement(By.id('input-confirm')).sendKeys(password_confirm);
                await driver.findElement(By.id('input-telephone')).sendKeys(phone);

                if (privacy) {
                    await driver.findElement(By.css('input[name=agree]')).click();
                }

                await driver.findElement(By.css('input[type="submit"]')).click();

                try {
                    // element is displayed - register success
                    let accountProfileDisplayed = await driver.findElement(By.id('common-success')).isDisplayed();
                    assert.equal(true, accountProfileDisplayed);
                } catch (err) {
                    // register fail
                    if (name == '' || name.length > 32) {
                        let nameErrorDisplayed = await driver.findElement(By.xpath("//*[text()='First Name must be between 1 and 32 characters!']")).isDisplayed();
                        assert.equal(true, nameErrorDisplayed);
                    }

                    if (lastname == '' || lastname.length > 32) {
                        let lastnameErrorDisplayed = await driver.findElement(By.xpath("//*[text()='Last Name must be between 1 and 32 characters!']")).isDisplayed();
                        assert.equal(true, lastnameErrorDisplayed);
                    }

                    if (email == '' || !checkRegex(email)) {
                        let emailErrorDisplayed = await driver.findElement(By.xpath("//*[text()='E-Mail Address does not appear to be valid!']")).isDisplayed();
                        assert.equal(true, emailErrorDisplayed);
                    }

                    if (phone == '' || phone.length < 3 || phone.length > 32) {
                        let phoneErrorDisplayed = await driver.findElement(By.xpath("//*[text()='Telephone must be between 3 and 32 characters!']")).isDisplayed();
                        assert.equal(true, phoneErrorDisplayed);
                    }

                    if (!privacy || email == 'test@test.test') {
                        let privacyErrorDisplayed = await driver.findElement(By.css('.alert.alert-danger.alert-dismissible')).isDisplayed();
                        assert.equal(true, privacyErrorDisplayed);
                    }

                    if (password != password_confirm || (password_confirm == '' && password != '')) {
                        let passwordConfirmErrorDisplayed = await driver.findElement(By.xpath("//*[text()='Password confirmation does not match password!']")).isDisplayed();
                        assert.equal(true, passwordConfirmErrorDisplayed);
                    } else if (password == '' || password.length < 4 || password.length > 20) {
                        let passwordErrorDisplayed = await driver.findElement(By.xpath("//*[text()='Password must be between 4 and 20 characters!']")).isDisplayed();
                        assert.equal(true, passwordErrorDisplayed);
                    }
                }
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

function handleFailure(err, driver) {
    console.error('Something went wrong!\n', err.stack, '\n');
    driver.quit();
}

async function getText(driver, id) {
    const el = await driver.findElement(By.id(id));
    return el.getText();
}

function checkRegex(email) {
    return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}