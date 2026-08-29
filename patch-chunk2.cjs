const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /console\.log\("Received upload-chunk request"\);/g,
  `fs.appendFileSync('upload_logs.txt', new Date().toISOString() + " Received upload-chunk request\\n");`
);
code = code.replace(
  /console\.log\("Multer parsed chunk, body:", req\.body\);/g,
  `fs.appendFileSync('upload_logs.txt', new Date().toISOString() + " Multer parsed chunk, index: " + req.body.chunkIndex + "\\n");`
);
code = code.replace(
  /fs\.renameSync\(chunkPath, targetPath\);/g,
  `fs.renameSync(chunkPath, targetPath); fs.appendFileSync('upload_logs.txt', new Date().toISOString() + " Renamed chunk " + chunkIndex + "\\n");`
);

fs.writeFileSync('server.ts', code);
