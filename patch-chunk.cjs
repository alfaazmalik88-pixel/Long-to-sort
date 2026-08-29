const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /app\.post\("\/api\/upload-chunk", upload\.single\("chunk"\), async \(req, res\) => \{/g,
  `app.post("/api/upload-chunk", (req, res, next) => { console.log("Received upload-chunk request"); next(); }, upload.single("chunk"), async (req, res) => {
    console.log("Multer parsed chunk, body:", req.body);`
);

fs.writeFileSync('server.ts', code);
