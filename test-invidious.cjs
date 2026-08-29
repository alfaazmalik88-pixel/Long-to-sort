const fetch = require('node-fetch');

async function test() {
  try {
    const res = await fetch("https://api.invidious.io/instances.json?sort_by=health,users");
    const data = await res.json();
    const instances = data.map(i => i[1]).filter(i => i.api === true && i.type === "https");
    
    for (const inst of instances) {
      console.log("Testing:", inst.uri);
      try {
        const vidRes = await fetch(inst.uri + "/api/v1/videos/jNQXAC9IVRw", { timeout: 3000 });
        if (vidRes.ok) {
          const vidData = await vidRes.json();
          if (vidData.formatStreams && vidData.formatStreams.length > 0) {
            console.log("Success with", inst.uri, vidData.formatStreams[0].url);
            return;
          }
        }
      } catch(e) {
        // ignore
      }
    }
  } catch (e) {
    console.error(e);
  }
}
test();
