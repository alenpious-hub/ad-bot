const puppeteer = require('puppeteer');

(async () => {
    // Launch a new browser instance
    const browser = await puppeteer.launch({
        headless: false, // Set to false to see the browser UI
        args: ['--no-sandbox', '--disable-setuid-sandbox','--incognito'] // These arguments are sometimes necessary for certain environments
    });
    
    // Create a new page
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768})
    // Navigate to the specified URL
    await page.goto('https://www.goethe.de/ins/in/en/sta/che/prf/gzb2.cfm');

    // Optional: Wait for a specific element to ensure the page has loaded
    const pageBody = await page.waitForSelector('body');
    console.log("body",pageBody);

    console.log('Page opened successfully!');

    // You can add more actions here if needed

    // Close the browser
    // await browser.close(); // Uncomment to close the browser after the task is done
})();
