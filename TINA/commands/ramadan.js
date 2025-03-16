const axios = require("axios");

module.exports.config = {
  name: "ramadan",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Khan Rahul RK",
  description: "Get Ramadan-related information",
  commandCategory: "Islam",
  usages: "ramadan",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  return api.sendMessage(
    "📌 Select an option:\n\n1️⃣ Sehri & Iftar Time\n2️⃣ Prayer Times\n3️⃣ Fasting Niyyat\n4️⃣ Fasting Invalidators\n\nReply with the corresponding number.",
    event.threadID,
    (error, info) => {
      global.client.handleReply.push({
        type: "selectOption",
        name: module.exports.config.name,
        messageID: info.messageID,
        author: event.senderID
      });
    },
    event.messageID
  );
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  if (event.senderID !== handleReply.author) return;

  let choice = event.body.trim();

  if (handleReply.type === "selectOption") {
    if (choice === "1" || choice === "2") {
      return api.sendMessage(
        "📍 Please type your Zilla (district) name to get the information.",
        event.threadID,
        (error, info) => {
          global.client.handleReply.push({
            type: "getZilla",
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            choice: choice
          });
        },
        event.messageID
      );
    } else {
      let url, response;

      try {
        switch (choice) {
          case "3":
            url = "https://bd-prayer-time.vercel.app/islam/niyot";
            response = await axios.get(url);
            return api.sendMessage(
              `🕋 **Fasting Niyyat**\n\n📖 Arabic: ${response.data["রোজার আরবি নিয়ত"]}\n🔤 Pronunciation: ${response.data["রোজার বাংলা উচ্চারণ"]}\n💬 Meaning: ${response.data["রোজার অর্থ"]}\n\n🍽 **Iftar Dua**\n📖 Arabic: ${response.data["ইফতারের দোয়া"]}\n🔤 Pronunciation: ${response.data["ইফতারের বাংলা উচ্চারণ"]}\n💬 Meaning: ${response.data["ইফতারের অর্থ"]}`,
              event.threadID,
              event.messageID
            );

          case "4":
            url = "https://bd-prayer-time.vercel.app/islam/ruja-vangar-karon";
            response = await axios.get(url);
            let reasons = Object.values(response.data)
              .map((item, index) => `${index + 1}. ${item}`)
              .join("\n");
            return api.sendMessage(`🚫 **Fasting Invalidators**\n\n${reasons}`, event.threadID, event.messageID);

          default:
            return api.sendMessage("❌ Invalid choice! Please reply with a valid number (1-4).", event.threadID, event.messageID);
        }
      } catch (error) {
        return api.sendMessage("⚠️ Error fetching data. Please try again later.", event.threadID, event.messageID);
      }
    }
  } else if (handleReply.type === "getZilla") {
    let zilla = event.body.trim().toLowerCase();
    let url, response;

    try {
      if (handleReply.choice === "1") {
        url = `https://bd-prayer-time.vercel.app/islam/sehri-ifter-time?zilla=${zilla}`;
        response = await axios.get(url);
        let times = response.data.times;

        return api.sendMessage(
          `🌙 **Sehri & Iftar Time**\n📍 Location: ${response.data.zilla}\n\n🗓 **Today (${times.today.todayDate})**\n🕌 Ramadan Day: ${times.today.ramadan_no}\n⏰ Sehri: ${times.today.sehri}\n🌅 Iftar: ${times.today.iftar}\n\n🗓 **Tomorrow (${times.tomorrow.tomorrowDate})**\n🕌 Ramadan Day: ${times.tomorrow.ramadan_no}\n⏰ Sehri: ${times.tomorrow.sehri}\n🌅 Iftar: ${times.tomorrow.ifter}`,
          event.threadID,
          event.messageID
        );
      } else if (handleReply.choice === "2") {
        url = `https://bd-prayer-time.vercel.app/islam/prayerTime?zilla=${zilla}`;
        response = await axios.get(url);
        let prayers = response.data.prayerTimes;

        return api.sendMessage(
          `🕌 **Prayer Times**\n📍 Location: ${response.data.zilla}\n\n🔹 Fajr: ${prayers["Fazar Waqt Start"]}\n🌞 Sunrise: ${prayers["Sun Rise"]}\n🔹 Dhuhr: ${prayers["Dhuhr Waqt Start"]}\n🔹 Asr: ${prayers["Asr Waqt Start"]}\n🌅 Maghrib/Iftar: ${prayers["Maghrib and Iftar Time"]}\n🌙 Isha: ${prayers["Isha Waqt Start"]}`,
          event.threadID,
          event.messageID
        );
      }
    } catch (error) {
      return api.sendMessage("⚠️ Error fetching data. Please check the district name and try again.", event.threadID, event.messageID);
    }
  }
};
