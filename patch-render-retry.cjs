const fs = require('fs');
let code = fs.readFileSync('src/lib/renderVideo.ts', 'utf8');

// Replace the fetch call with a retry loop
const oldFetch = `      const res = await fetch('/api/render', {
        method: 'POST',
        body: renderFormData
      });

      if (!res.ok) {
        throw new Error("Failed to start render job");
      }
      const response = await res.json();`;

const newFetch = `      let response;
      let retries = 3;
      while (retries > 0) {
        try {
          const res = await fetch('/api/render', {
            method: 'POST',
            body: renderFormData
          });
          
          const text = await res.text();
          if (!res.ok) {
             throw new Error("Failed to start render job: " + res.status);
          }
          try {
             response = JSON.parse(text);
             break; // Success
          } catch (e) {
             throw new Error("Server returned HTML or invalid JSON. Internet connection issue.");
          }
        } catch (err) {
          retries--;
          if (retries === 0) throw err;
          await new Promise(r => setTimeout(r, 2000));
        }
      }`;

code = code.replace(oldFetch, newFetch);

fs.writeFileSync('src/lib/renderVideo.ts', code);
console.log("Patched renderVideo.ts with retry logic");
