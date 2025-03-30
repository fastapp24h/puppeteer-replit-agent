const express = require('express');
const runReplit = require('./runReplit');

const app = express();
const PORT = process.env.PORT || 3000;

// usa il parser JSON integrato in express
app.use(express.json());

app.post('/', async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt mancante' });
  }

  try {
    const url = await runReplit(prompt);
    res.json({ webview_url: url });
  } catch (err) {
    console.error('Errore Puppeteer:', err);
    res.status(500).json({ error: 'Errore durante l\'esecuzione di Puppeteer' });
  }
});

app.listen(PORT, () => {
  console.log(`Server attivo su porta ${PORT}`);
});
