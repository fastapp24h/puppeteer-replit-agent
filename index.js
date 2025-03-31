import runReplit from './runReplit.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const prompt = req.body.prompt;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt mancante' });
  }

  try {
    const url = await runReplit(prompt);
    res.status(200).json({ webview_url: url });
  } catch (err) {
    console.error('Errore Puppeteer:', err);
    res.status(500).json({ error: "Errore durante l'esecuzione di Puppeteer" });
  }
}
