const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(
  /<script src="https:\/\/quge5.com\/88\/tag.min.js" data-zone="273872" async data-cfasync="false"><\/script>/,
  '<!-- <script src="https://quge5.com/88/tag.min.js" data-zone="273872" async data-cfasync="false"></script> -->'
);

fs.writeFileSync('index.html', code);
