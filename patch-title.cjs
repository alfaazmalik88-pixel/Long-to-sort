const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "filters.push(`drawtext=text='${escapedTitle}':fontcolor=yellow:fontsize=72:x=(w-text_w)/2:y=(h/6):box=1:boxcolor=black@0.6:boxborderw=20`);",
  "filters.push(`drawtext=text='${escapedTitle}':fontcolor=yellow:fontsize=48:x=(w-text_w)/2:y=(h/3.5):bordercolor=black:borderw=4`);"
);

fs.writeFileSync('server.ts', code);
