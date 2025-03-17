const axios = require("axios");
const fs = require("fs-extra");
const tinyurl = require("tinyurl");
const baseApiUrl = async () => {
  
  return `https://www.noobs-api.rf.gd/dipto`
};

const config = {
  name: "autolink",
  version: "2.0",
  author: "RAHAT",
  credits: "RAHAT KHAN",
  description: "Auto download video from tiktok, facebook, Instagram, YouTube, and more",
  category: "media",
  commandCategory: "media",
  usePrefix: true,
  prefix: true,
  dependencies: {
    "tinyurl": "",
    "fs-extra": "",
  },
};

const run = () => {};
const onChat = async ({ api, event }) => {
  let dipto = event.body ? event.body : "", ex, cp;
  try {
    if (
      dipto.startsWith("https://vt.tiktok.com") ||
      dipto.startsWith("https://www.tiktok.com/") ||
      dipto.startsWith("https://www.facebook.com") ||
      dipto.startsWith("https://www.instagram.com/") ||
      dipto.startsWith("https://youtu.be/") ||
      dipto.startsWith("https://youtube.com/") ||
      dipto.startsWith("https://x.com/") ||
      dipto.startsWith("https://youtube.com/")
|| dipto.startsWith("https://www.instagram.com/p/") ||
      dipto.startsWith("https://pin.it/") ||
      dipto.startsWith("https://twitter.com/") ||
      dipto.startsWith("https://vm.tiktok.com") ||
      dipto.startsWith("https://fb.watch")
    ) {
      api.setMessageReaction("⌛", event.messageID, true);
      const w = await api.sendMessage("Wait Bby <😘", event.threadID);
      const response = await axios.get(`${await baseApiUrl()}/alldl?url=${encodeURIComponent(dipto)}`);
      const d = response.data;
      if (d.result.includes(".jpg")) {
        ex = ".jpg";
        cp = "Here's your Photo <😘";
      } else if (d.result.includes(".png")) {
        ex = ".png";
        cp = "Here's your Photo <😘";
      } else if (d.result.includes(".jpeg")) {
        ex = ".jpeg";
        cp = "Here's your Photo <😘";
      } else {
        ex = ".mp4";
        cp = d.cp;
      }
      const path = __dirname + `/cache/video${ex}`;
      fs.writeFileSync(path, Buffer.from((await axios.get(d.result, { responseType: "arraybuffer" })).data, "binary"));
      const shortUrl = await tinyurl.shorten(d.result);
      api.setMessageReaction("✅", event.messageID, true);
      api.unsendMessage(w.messageID);
      await api.sendMessage({
          body: `${d.cp || null}\n✅ | Link: ${shortUrl || null}`,
          attachment: fs.createReadStream(path),
        }, event.threadID, () => fs.unlinkSync(path), event.messageID
      )
    }
  } catch (err) {
    api.setMessageReaction("❌", event.messageID, true);
    console.log(err);
    api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports = {
  config,
  onChat,
  onStart,
  run: onStart,
  handleEvent: onChat,
};
