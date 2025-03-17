const axios = require("axios");
const fs = require("fs-extra");
const tinyurl = require("tinyurl");
const baseApiUrl = async () => {
  
  return `https://www.noobs-api.rf.gd/dipto`
};
  return base.data.api;
};

module.exports.config ={
    name: "prompt",
    version: "6.9",
    credits: "RAHUL",
    countDown: 5,
    hasPermssion: 0,
    description: " image to prompt",
    category: "tools",
    commandCategory: "tools",
    usePrefix: true,
    prefix: true,
    usages: "reply [image]"
  },

module.exports.run = async ({ api, event,args }) =>{
    const dip = event.messageReply?.attachments[0]?.url || args.join(' ');
    if (!dip) {
      return api.sendMessage('Please reply to an image.', event.threadID, event.messageID);
    }
    try {
      const prom = (await axios.get(`${await baseApiUrl()}/prompt?url=${encodeURIComponent(dip)}`)).data.data[0].response;
         api.sendMessage(prom, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      return api.sendMessage('Failed to convert image into text.', event.threadID, event.messageID);
    }
  };
