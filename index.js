const express = require('express');
const runReplit = require('./runReplit');

const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt mancante' });
  }

  try {
    const resultUrl = await runReplit(prompt);
    return res.status(200).json({ url: resultUrl });
  } catch (err) {
    console.error('Errore Puppeteer:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server attivo su porta 3000');
});
