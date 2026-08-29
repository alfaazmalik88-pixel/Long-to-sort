const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const queueLogic = `
  const renderQueue = [];
  let activeRenders = 0;
  const MAX_CONCURRENT_RENDERS = 1;

  function processNextRender() {
    if (activeRenders < MAX_CONCURRENT_RENDERS && renderQueue.length > 0) {
      activeRenders++;
      const nextJob = renderQueue.shift();
      if (nextJob) nextJob();
    }
  }
`;

code = code.replace('const renderJobs = new Map();', queueLogic + '\n  const renderJobs = new Map();');

code = code.replace(
  'job.url = `/uploads/${outputFileName}`;',
  'job.url = `/uploads/${outputFileName}`;\n        }\n        activeRenders--;\n        processNextRender();\n        if (false) {'
);

code = code.replace(
  'job.error = err.message + \'\\n\' + stderr;',
  'job.error = err.message + \'\\n\' + stderr;\n        }\n        activeRenders--;\n        processNextRender();\n        if (false) {'
);

code = code.replace(
  '.save(outputPath);',
  `;
      renderQueue.push(() => {
        command.save(outputPath);
      });
      processNextRender();`
);

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts with queue");
