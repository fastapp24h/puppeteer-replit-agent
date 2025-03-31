import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async function runReplit(prompt) {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath || '/usr/bin/chromium-browser',
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.goto('https://replit.com/~', { waitUntil: 'networkidle2' });

    // Clicca su "Create" tramite evaluate
    await page.waitForTimeout(2000);
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes("Create"));
      if (btn) btn.click();
    });

    // Attendi il campo Replit AI
    await page.waitForSelector('textarea[placeholder*="What would you like to make"]', { timeout: 15000 });
    await page.type('textarea[placeholder*="What would you like to make"]', prompt, { delay: 30 });
    await page.keyboard.press('Enter');

    // Aspetta iframe con la demo
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
}
