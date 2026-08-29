const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.get('/download', (req, res) => {
  const filePath = path.join(__dirname, 'test.txt');
  fs.writeFileSync(filePath, 'hello');
  res.download(filePath, 'test.txt', (err) => {
    console.log('Download callback err:', err);
    fs.unlinkSync(filePath);
  });
});

const server = app.listen(3001, async () => {
  const fetch = (await import('node-fetch')).default;
  const res = await fetch('http://localhost:3001/download');
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Body:', text);
  server.close();
});
