import fetch from 'node-fetch';

async function test() {
  // Common cobalt instances found online
  const instances = [
    "https://cobalt.q-n.cc",
    "https://api.cobalt.qa",
    "https://co.wuk.sh",
    "https://cobalt.tools",
    "https://api.cobalt.tools",
    "https://cobalt-api.kwiatekit.com"
  ];
  for (const inst of instances) {
    console.log("Testing:", inst);
    try {
      const body = {
        url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
        vQuality: "720"
      };
      
      const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      };
      
      const res = await fetch(inst + "/api/json", { method: 'POST', headers, body: JSON.stringify(body), signal: AbortSignal.timeout(3000) });
      const text = await res.text();
      console.log("Response from", inst, ":", text.substring(0, 100));
      
      // Also try v10 endpoint
      const res2 = await fetch(inst, { method: 'POST', headers, body: JSON.stringify(body), signal: AbortSignal.timeout(3000) });
      const text2 = await res2.text();
      console.log("Response v10 from", inst, ":", text2.substring(0, 100));
      
    } catch(e) {}
  }
}
test();
