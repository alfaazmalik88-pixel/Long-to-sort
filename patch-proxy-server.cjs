const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `      // Use yt-dlp with options to bypass YouTube blocking (multiple techniques)
      await youtubedl(url, {
        output: outputFilename,
        format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        mergeOutputFormat: 'mp4',
        noCheckCertificates: true,
        noWarnings: true,
        addHeader: [
          'referer:youtube.com',
          'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        ],
        // Bypass geographic restrictions
        geoBypass: true,
      });`;

const replacement = `      // MULTIPLE SERVER PROXY LOGIC to bypass YouTube blocks
      let success = false;
      let lastError = null;
      
      console.log("Fetching multiple servers (proxies) to avoid YouTube blocking...");
      let proxies = [];
      try {
        const proxyRes = await fetch("https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/http/data.txt");
        const proxyText = await proxyRes.text();
        proxies = proxyText.split('\\n').map(p => p.trim()).filter(p => p.length > 5);
      } catch (e) {
        console.error("Could not fetch proxies:", e);
      }
      
      // Try without proxy first (might work for non-youtube links)
      proxies.unshift(null);
      
      // Try up to 4 different servers/proxies
      for (let i = 0; i < Math.min(4, proxies.length); i++) {
        const proxy = i === 0 ? null : proxies[Math.floor(Math.random() * Math.min(50, proxies.length))];
        console.log(\`Attempt \${i+1} using server: \${proxy || 'Direct (No Proxy)'}\`);
        
        try {
          const dlOptions = {
            output: outputFilename,
            format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            mergeOutputFormat: 'mp4',
            noCheckCertificates: true,
            noWarnings: true,
            addHeader: [
              'referer:youtube.com',
              'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
            ],
            geoBypass: true,
          };
          
          if (proxy) {
            dlOptions.proxy = proxy;
          }
          
          await youtubedl(url, dlOptions);
          success = true;
          console.log("Download successful!");
          break; // It worked!
        } catch (err) {
          lastError = err;
          console.error(\`Server attempt \${i+1} failed.\`);
        }
      }
      
      if (!success) {
        throw lastError || new Error("Failed after trying multiple servers.");
      }`;

if (code.includes('output: outputFilename,')) {
  code = code.replace(target, replacement);
  fs.writeFileSync('server.ts', code);
  console.log("Patched server.ts with multi-server proxy logic!");
} else {
  console.log("Could not find target in server.ts!");
}
