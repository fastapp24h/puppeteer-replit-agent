const puppeteer = require('puppeteer');

module.exports = async function runReplit(prompt) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Vai su Replit homepage
    await page.goto('https://replit.com/~', { waitUntil: 'networkidle2' });

    // Aspetta un elemento per confermare che la pagina è caricata
    await page.waitForSelector('header', { timeout: 15000 });

    console.log('Pagina caricata:', page.url());

    await browser.close();
    return page.url();

  } catch (err) {
    if (browser) await browser.close();
    console.error('Errore completo Puppeteer:', err);
    throw new Error('Errore durante l\'esecuzione di Puppeteer: ' + err.message);
  }
};
};
