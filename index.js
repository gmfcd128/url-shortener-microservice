require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const validUrl = require('valid-url');

// Basic Configuration
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static files
app.use('/public', express.static(`${process.cwd()}/public`));

// Routes
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// In-memory storage for URLs
let urlDatabase = [];
let urlCounter = 1;

// Endpoint to shorten URL
app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;

  // Validate URL
  if (!validUrl.isWebUri(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Store the URL and generate short URL
  const shortUrl = urlCounter;
  urlDatabase.push({ originalUrl, shortUrl });
  urlCounter++;

  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// Endpoint to redirect to original URL
app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = parseInt(req.params.short_url);

  const urlEntry = urlDatabase.find(entry => entry.shortUrl === shortUrl);

  if (urlEntry) {
    res.redirect(urlEntry.originalUrl);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

// Start server
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
