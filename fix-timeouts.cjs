const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Just remove all req.setTimeout(0) and res.setTimeout(0) except for /api/render and /api/upload-complete if needed.
// Actually, let's just remove them ALL from upload-chunk
code = code.replace(/app\.post\("\/api\/upload-chunk",[\s\S]*?res\.setTimeout\(0\);/g, (match) => {
  return match.replace(/req\.setTimeout\(0\);/g, '').replace(/res\.setTimeout\(0\);/g, '');
});

fs.writeFileSync('server.ts', code);
