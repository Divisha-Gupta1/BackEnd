const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to log requests
app.use((req, res, next) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    url: req.originalUrl,
    protocol: req.protocol,
    method: req.method,
    hostname: req.hostname,
    query: req.query, 
    headers: req.headers, 
    userAgent: req.get('User-Agent'), 
  };

  const logFilePath = path.join(__dirname, 'requests.log');
  const logData = JSON.stringify(logEntry) + '\n';

  fs.appendFile(logFilePath, logData, (err) => {
    if (err) {
      console.error('Failed to write to log file', err);
    }
  });

  next();
});

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});