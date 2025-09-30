// index.js
import 'dotenv/config'; // automatically loads .env
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Import your Playwright monitors
import analyzeSite from './playwright/analyzeSite.js';
import monitorCompetitor from './playwright/monitorCompetitor.js';
import monitorKeywords from './playwright/monitorKeywords.js';

// Import utilities
import { sendAlert } from './utils/notify.js';

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Competitor Endpoint
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

// Keyword Endpoint
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

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 SEO Monitor API running on http://localhost:${PORT}`);
});