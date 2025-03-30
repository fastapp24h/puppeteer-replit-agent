const puppeteer = require('puppeteer');

module.exports = async function runReplit(prompt) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://replit.com/new', { waitUntil: 'domcontentloaded' });

  // Attendi che la pagina carichi l'editor AI (personalizza se necessario)
  await page.waitForTimeout(5000); // Attendi l'interfaccia AI

  // Incolla il prompt
  await page.keyboard.type(prompt);

  // Optional: accetta opzioni (checkbox) e clicca "Approve"
  // Da adattare in base alla UI Replit corrente

  await page.waitForTimeout(5000); // Attendi che generi la WebView

  const url = page.url(); // Prende il link della demo

  await browser.close();
  return url;
};
