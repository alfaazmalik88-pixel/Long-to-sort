const youtubedl = require('youtube-dl-exec');
const fetch = require('node-fetch');

async function test() {
  const proxyListUrl = "https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/http/data.txt";
  const text = await (await fetch(proxyListUrl)).text();
  const proxies = text.split('\n').filter(p => p.trim() !== '');
  
  for(let i = 0; i < 5; i++) {
    const proxy = proxies[Math.floor(Math.random() * proxies.length)];
    console.log("Trying proxy:", proxy);
    try {
      const output = await youtubedl('https://www.youtube.com/watch?v=jNQXAC9IVRw', {
        dumpJson: true,
        proxy: proxy,
        noWarnings: true
      });
      console.log("Success! Title:", output.title);
      return;
    } catch (e) {
      console.log("Failed proxy:", proxy, e.message.split('\n')[0]);
    }
  }
}
test();
