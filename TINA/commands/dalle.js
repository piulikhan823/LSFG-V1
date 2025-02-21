const axios = require('axios');
const baseApiUrl = async () => {
  const base = await axios.get(`https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`);
  return base.data.api;
}; 
module.exports = {
  config: {
  name: "dalle",
  version: "1.0",
  credits: "Khan Rahul RK",
  hasPermssion: 2,
  usePrefix: true,
  prefix: true,
  description: "Generate images by Dalle-3 AI",
  commandCategory: "download",
  category: "download",
  usages:
    "[text] \nJamon [A 17/18/19 years old boy/girl watching football match on tv and written Rahul and 69 on the back of his Dress , 4k]",
  cooldowns: 5,
}, 
  run: async({ api, event, args }) => {
    const prompt = (event.messageReply?.body.split("dalle")[1] || args.join(" ")).trim();
    if (!prompt) return api.sendMessage("❌| Wrong Format. ✅ | Use: 17/18 years old boy/girl watching football match on TV with 'RAHUL' and '69' written on the back of their dress, 4k", event.threadID, event.messageID);
    try {
       //const cookies = "cookies here (_U value)";
const cookies = ["1usZMlKqB-06BnXZow7OSmDJq-2mkiVMXkTqPuVEHo4z63GtYAihAPLg-kjp4NlGHqPV9_kzuxwHS8XPQK_N7BwNSu9SVpOvNWVyOtpSsZZbPoBmo5-SVOao45WGaR_o_aV9MeRsVRAWuxu_vwg6oHop2C9y51k97BF13L8ww1zb4A2r1Y_AA07nkC8q5ix8h6qO8pu2ZD2iesS4flCM-jw"];
const randomCookie = cookies[Math.floor(Math.random() * cookies.length)];
      const wait = api.sendMessage("𝙥𝙡𝙚𝙖𝙨𝙚 𝙬𝙞𝙩𝙝𝙚 𝙥𝙧𝙤𝙘𝙚𝙨𝙨𝙞𝙣𝙜 𝙮𝙤𝙪𝙧 𝙞𝙢𝙖𝙜𝙚 \n\n𝙠𝙝𝙖𝙣 𝙧𝙖𝙝𝙪𝙡 𝙧𝙠💞", event.threadID);
      const response = await axios.get(`${await baseApiUrl()}/dalle?prompt=${prompt}&key=dipto008&cookies=${randomCookie}`);
const imageUrls = response.data.imgUrls || [];
      if (!imageUrls.length) return api.sendMessage("Empty response or no images generated.", event.threadID, event.messageID);
      const images = await Promise.all(imageUrls.map(url => axios.get(url, { responseType: 'stream' }).then(res => res.data)));
    api.unsendMessage(wait.messageID);
   api.sendMessage({ body: `𝙨𝙪𝙘𝙚𝙨𝙨𝙛𝙪𝙡 𝙮𝙤𝙪𝙧 𝙞𝙢𝙖𝙜𝙚 \n\n𝙠𝙝𝙖𝙣 𝙧𝙖𝙝𝙪𝙡 𝙧𝙠💞`, attachment: images }, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage(`Generation failed!\nError: ${error.message}`, event.threadID, event.messageID);
    }
  }
}
