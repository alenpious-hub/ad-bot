const puppeteer = require('puppeteer');
const config = require('./config');

let flag = false;

const launchBrowser = async () => {
    return await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--incognito', '--start-fullscreen'],
        defaultViewport: null
    });
};

const removePopUp = async (page) => {
    const { popupRoot, popupButton } = config.selectors;
    try {
        const container = await page.waitForSelector(popupRoot, { timeout: config.popupTimeout });
        if (container) {
            const rootContainer = await page.waitForSelector(popupRoot);
            const root = await rootContainer.evaluateHandle(el => el.shadowRoot);
            const btn = await root.waitForSelector(popupButton);

            await btn.evaluate(b => b.click());
            flag = true;
        }
    } catch (err) {
        console.log("No pop-up found or error:", err);
    }
};

const selectModules = async (page, preferredModules) => {
    await page.waitForSelector(config.selectors.selectModules);
    const buttons = await page.$$(config.selectors.selectModules + ' button');

    for (const button of buttons) {
        const moduleName = await button.evaluate(b => b.textContent.trim());
        if (preferredModules.includes(moduleName)) {
            const isDisabledButton = await button.evaluate(b => b.disabled);
            if (!isDisabledButton) {
                await button.evaluate(b => b.click());
            }
        }
    }
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
};

const clickCheckBox = async (page) => {
    try {
        await page.waitForSelector(config.selectors.checkoutButton);
        const buttonCheckout = await page.$(config.selectors.checkoutButton);
        await buttonCheckout.evaluate(b => b.click());
    } catch (error) {
        console.error("Error in clickCheckBox:", error);
    }
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
};

const bookForMyself = async (page) => {
    await page.waitForSelector(config.selectors.bookForMyselfButton);
    await page.evaluate(() => {
        document.querySelectorAll(config.selectors.bookForMyselfButton)[1].click();
    });
};

module.exports = {
    flag,
    launchBrowser,
    removePopUp,
    selectModules,
    clickCheckBox,
    bookForMyself
};
