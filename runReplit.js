const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports = async function runReplit(prompt) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto('https://replit.com/new', { waitUntil: 'networkidle2' });
  await page.waitForTimeout(3000);
  await page.keyboard.type(prompt);
  await page.waitForTimeout(5000);

  const url = page.url();
  await browser.close();
  return url;
};
