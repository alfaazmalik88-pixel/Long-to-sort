import fetch from 'node-fetch';

async function test() {
  const instances = [
    "https://pipedapi.kavin.rocks",
    "https://pipedapi.tokhmi.xyz",
    "https://pipedapi.syncpundit.io",
    "https://pipedapi.lunar.icu",
    "https://piped-api.garudalinux.org"
  ];
  for (const inst of instances) {
    console.log("Testing:", inst);
    try {
      const vidRes = await fetch(inst + "/streams/jNQXAC9IVRw", { signal: AbortSignal.timeout(3000) });
      if (vidRes.ok) {
        const vidData = await vidRes.json();
        if (vidData.videoStreams && vidData.videoStreams.length > 0) {
          console.log("Success with", inst, vidData.videoStreams[0].url.substring(0, 50));
          return;
        }
      }
    } catch(e) {}
  }
}
test();
