// index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Import your Playwright monitors
const analyzeSite = require('./playwright/analyzeSite'); // Make sure this exports a function
const monitorCompetitor = require('./playwright/monitorCompetitor');
const monitorKeywords = require('./playwright/monitorKeywords');

// Import utilities
const { sendAlert } = require('./utils/notify');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/screenshots', express.static(path.join(__dirname, 'public/screenshots')));

// ---------------------------
// SEO Monitor Endpoint
// ---------------------------
app.post('/api/seo', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const result = await analyzeSite(url);

    // Send alert if broken links found
    if (result.brokenLinks && result.brokenLinks.length > 0) {
      await sendAlert(
        `SEO Alert: Broken links on ${url}`,
        result.brokenLinks.join('\n')
      );
    }

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------
// Competitor Monitor Endpoint
// ---------------------------
app.post('/api/competitor', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const data = await monitorCompetitor(url);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------
// Keyword Monitor Endpoint
// ---------------------------
app.post('/api/keywords', async (req, res) => {
  const { url, keywords } = req.body;
  if (!url || !keywords) return res.status(400).json({ error: 'Missing parameters' });

  try {
    const data = await monitorKeywords(url, keywords);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------
// Start Server
// ---------------------------
app.listen(PORT, () => {
  console.log(`🚀 SEO Monitor API running on http://localhost:${PORT}`);
});
