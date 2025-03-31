const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports = async function runReplit(prompt) {
  let browser;
  try {
    console.log('Lancio browser');
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless
    });

    const page = await browser.newPage();
    console.log('Navigo su Replit');
    await page.goto('https://replit.com/~', { waitUntil: 'networkidle2' });

    console.log('Attendo pulsante "Create"');
    await page.waitForSelector('button:has-text("Create")', { timeout: 15000 });
    await page.click('button:has-text("Create")');

    console.log('Inserisco prompt');
    await page.waitForSelector('textarea[placeholder*="What would you like to make"]', { timeout: 15000 });
    await page.type('textarea[placeholder*="What would you like to make"]', prompt, { delay: 30 });
    await page.keyboard.press('Enter');

    console.log('Attendo iframe webview');
    await page.waitForSelector('iframe', { timeout: 60000 });

    const finalUrl = await page.evaluate(() => {
      const iframe = document.querySelector('iframe');
      return iframe ? iframe.src : null;
    });

    await browser.close();
    console.log('Link generato:', finalUrl);
    return finalUrl;
  } catch (err) {
    console.error('Errore interno Puppeteer:', err);
    if (browser) await browser.close();
    throw new Error('Errore interno Puppeteer: ' + err.message);
  }
};
