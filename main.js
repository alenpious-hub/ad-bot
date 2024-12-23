const puppeteer = require('puppeteer');
const credentials = require('./credentials');
const config = require('./config');
const { removePopUp } = require('./utils'); // Assuming you have the utility to remove pop-ups

let flag = false;

const runBooking = async (browser, user) => {
    const { username, password, name } = user;
    let page;
    let reachedModulePage = false;
    let retries = 0;

    while (!reachedModulePage && retries < config.maxRetries) {
        page = await browser.newPage();
        await page.setUserAgent(config.userAgent);

        try {
            await page.goto(config.loginUrl, { waitUntil: "domcontentloaded" });
            await page.waitForSelector(config.selectors.loginForm);
            await page.type(config.selectors.username, username);
            await page.type(config.selectors.password, password);

            console.log(`${name} - flag before`, flag);
            await removePopUp(page);
            console.log(`${name} - flag after`, flag);

            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle0' }),
                page.click(config.selectors.loginButton)
            ]);

            await page.goto(config.modulePageUrl, { waitUntil: 'networkidle0' });
            if (!flag) {
                await removePopUp(page);
            }

            // Check if the page has loaded the desired section
            const hasReachedPage = await page.evaluate(() => document.querySelector('.pr-buttons') !== null);

            if (hasReachedPage) {
                console.log(`Page opened successfully for ${name}!`);
                reachedModulePage = true;
            } else {
                console.log(`${name} - Module page not reached, retrying...`);
                await page.close();
                retries++;
            }
        } catch (error) {
            console.error(`${name} - Error during script execution:`, error);
            await page.close();
            retries++;
        }
    }

    if (!reachedModulePage) {
        console.log(`${name} - Failed to reach Module page after ${config.maxRetries} retries.`);
        await page.close();
    }
};

const executeAllScripts = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--incognito', '--start-fullscreen'],
        defaultViewport: null
    });

    const userChunks = [];

    for (let i = 0; i < credentials.length; i += config.concurrentLimit) {
        userChunks.push(credentials.slice(i, i + config.concurrentLimit));
    }

    for (const userChunk of userChunks) {
        await Promise.all(userChunk.map(user => runBooking(browser, user)));
    }

    console.log("All scripts executed!");
};

executeAllScripts();
