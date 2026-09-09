const fs = require('fs');
let content = fs.readFileSync('/app/applet/index.html', 'utf8');

// Remove the Adsterra script from head
content = content.replace(
  '    <!-- ADSTERRA SCRIPT (Social Bar) -->\n    <script type="text/javascript" data-cfasync="false" async="async" src="https://pl31243129.profitableratecpmnetwork.com/ae/26/ae/ae26ae9ff287315edb888a1af08e830f.js"></script>\n',
  ''
);

// Add it just before the closing body tag
content = content.replace(
  '  </body>',
  '    <!-- ADSTERRA SCRIPT (Social Bar) -->\n    <script type="text/javascript" data-cfasync="false" async="async" src="//pl31243129.profitableratecpmnetwork.com/ae/26/ae/ae26ae9ff287315edb888a1af08e830f.js"></script>\n  </body>'
);

fs.writeFileSync('/app/applet/index.html', content);
