const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports = async function runReplit(prompt) {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless
    });

    const page = await browser.newPage();
    await page.goto('https://replit.com/~', { waitUntil: 'networkidle2' });

    // Aspetta il pulsante "New Repl" e clicca
    await page.waitForSelector('button:has-text("Create")', { timeout: 15000 });
    await page.click('button:has-text("Create")');

    // Attendi input prompt Replit AI
    await page.waitForSelector('textarea[placeholder*="What would you like to make"]', { timeout: 15000 });
    await page.type('textarea[placeholder*="What would you like to make"]', prompt, { delay: 30 });
    await page.keyboard.press('Enter');

    // Attendi che venga generata la demo
    await page.waitForSelector('iframe', { timeout: 60000 });

    // Estrai link della webview
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
