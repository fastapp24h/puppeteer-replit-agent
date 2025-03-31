const puppeteer = require('puppeteer-core');

module.exports = async function runReplit(prompt) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto('https://replit.com/~', { waitUntil: 'networkidle2' });

    await page.waitForSelector('button:has-text("Create")', { timeout: 15000 });
    await page.click('button:has-text("Create")');

    await page.waitForSelector('textarea[placeholder*="What would you like to make"]', { timeout: 15000 });
    await page.type('textarea[placeholder*="What would you like to make"]', prompt, { delay: 30 });
    await page.keyboard.press('Enter');

    await page.waitForSelector('iframe', { timeout: 60000 });

    const finalUrl = await page.evaluate(() => {
      const iframe = document.querySelector('iframe');
      return iframe ? iframe.src : null;
    });

    await browser.close();
    return finalUrl;
  } catch (err) {
    if (browser) await browser.close();
    throw new Error('Errore interno Puppeteer: ' + err.message);
  }
};
