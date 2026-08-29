const fs = require('fs');
let code = fs.readFileSync('src/lib/renderVideo.ts', 'utf8');

const oldPoll = `          const statusRes = await fetch(\`/api/render/status/\${actualJobId}\`);
          if (!statusRes.ok) throw new Error("Failed to fetch job status");
          
          const job = await statusRes.json();`;

const newPoll = `          const statusRes = await fetch(\`/api/render/status/\${actualJobId}\`);
          const text = await statusRes.text();
          if (!statusRes.ok) throw new Error("Failed to fetch job status");
          
          let job;
          try {
             job = JSON.parse(text);
          } catch (e) {
             throw new Error("Invalid JSON from status endpoint");
          }`;

code = code.replace(oldPoll, newPoll);

fs.writeFileSync('src/lib/renderVideo.ts', code);
console.log("Patched renderVideo.ts polling logic");
