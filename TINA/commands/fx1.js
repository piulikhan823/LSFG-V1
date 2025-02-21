const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "fx1",
    description: "Generate image from fal ai flux pro",
    cooldown: 5,
    commandCategory: "image",
    hasPermssion: 0,
    hasPrefix: false,
    cooldowns: 5,
    credits: "𝐊𝐡𝐚𝐧 𝐑𝐚𝐡𝐮𝐥 𝐑𝐊",
    usage: "{p}{n} ",
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { messageID } = event;
        const prompt = args.join(' ');

        if (!prompt) {
            return api.sendMessage('Please provide a prompt', event.threadID, messageID);
        }

        const nazrul = await new Promise(resolve => { 
            api.sendMessage(`֎ 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗇𝗀 ${prompt} 𝗂𝗆𝖺𝗀𝖾...`, event.threadID, (err, info1) => {
                resolve(info1);
            }, event.messageID);
        });

        const apiUrl = `https://xnilnew404.onrender.com/xnil/flux?prompt=${encodeURIComponent(prompt)}`;

        const nazrulb = await axios.get(apiUrl, { responseType: 'stream' });

        const message = {
            attachment: nazrulb.data,   
        };

        api.unsendMessage(nazrul.messageID);

        api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
        api.sendMessage(`An error occurred: ${error.message}`, event.threadID);
    }
};
