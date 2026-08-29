const youtubedl = require('youtube-dl-exec');

async function test() {
  const clients = [
    "android",
    "web",
    "mweb",
    "ios",
    "tv",
    "android,web",
    "web,ios",
    "web_safari"
  ];

  for(const client of clients) {
    console.log("Trying client:", client);
    try {
      const output = await youtubedl('https://www.youtube.com/watch?v=jNQXAC9IVRw', {
        dumpJson: true,
        extractorArgs: "youtube:player_client=" + client,
        noWarnings: true
      });
      console.log("Success! Title:", output.title);
      return;
    } catch (e) {
      console.log("Failed client:", client, e.message.split('\n')[0].substring(0, 100));
    }
  }
}
test();
