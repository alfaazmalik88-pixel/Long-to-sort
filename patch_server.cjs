const fs = require('fs');

let serverContent = fs.readFileSync('server.ts', 'utf8');

// Replace exec with spawn or add maxBuffer and loglevel error
const searchFfmpegExec = /exec\(command, \(error, stdout, stderr\) => \{/g;
serverContent = serverContent.replace(searchFfmpegExec, 'exec(command, { maxBuffer: 1024 * 1024 * 100 }, (error, stdout, stderr) => {');

// Add loglevel error to avoid massive stderr
const searchFfmpegCommand1 = /-c:a aac -b:a 128k/g;
serverContent = serverContent.replace(searchFfmpegCommand1, '-c:a aac -b:a 128k -loglevel error');

// Also, let's limit concurrency using a simple async queue to prevent server crashing from 3 simultaneous exports.
// Wait, we can just patch it by adding a simple queue at the top level of /api/trim
const queueCode = `
const trimQueue = [];
let isTrimming = false;

const processTrimQueue = () => {
  if (isTrimming || trimQueue.length === 0) return;
  isTrimming = true;
  const { req, res, next } = trimQueue.shift();
  
  // Custom response hook to trigger next in queue when done
  const originalDownload = res.download.bind(res);
  const originalStatus = res.status.bind(res);
  
  let finished = false;
  const finish = () => {
    if (!finished) {
      finished = true;
      isTrimming = false;
      setTimeout(processTrimQueue, 500);
    }
  };

  res.download = (path, name, cb) => {
    originalDownload(path, name, (err) => {
      finish();
      if (cb) cb(err);
    });
  };

  res.status = (code) => {
    const s = originalStatus(code);
    const originalJson = s.json.bind(s);
    s.json = (data) => {
      originalJson(data);
      finish();
    };
    return s;
  };
  
  next();
};

app.post('/api/trim', (req, res) => {
  trimQueue.push({ req, res, next: () => handleTrim(req, res) });
  processTrimQueue();
});

const handleTrim = (req, res) => {
`;

// Replace app.post('/api/trim' with the queued version
serverContent = serverContent.replace(/app\.post\('\/api\/trim', \(req, res\) => \{/g, queueCode);

// Close the handleTrim bracket
const searchEndOfTrim = /res\.download\([\s\S]*?\}\);\n  \}\);\n\}\);/m;
serverContent = serverContent.replace(searchEndOfTrim, (match) => match.replace(/\}\);$/, '};\n};')); // Close handleTrim

fs.writeFileSync('server.ts', serverContent);
console.log("Server patched with queue and ffmpeg limits.");
