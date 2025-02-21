const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "ffinfo",
    version: "1.0.0",
    hasPermission: 0,
    credits: "RAHAT",
    description: "Free Fire Lover",
    usePrefix: true,
    commandCategory: "Khan Rahul RK",
    usages: "Fire Fire All Info",
    cooldowns: 5,
    dependencies: {
		vi: "",
			en: ""
		},
		category: "information",
		guide: {
			vi: "[UID]",
			en: ".ffinfo [UID]"
		}
	},

	onStart: async function ({ api, args, message, event }) {
		const uid = args[0];
		if (!uid) return message.reply("Please provide a UID!");

		const apiUrl = `http://riad.life/Ff.php?uid=${uid}`;

		// Initial "please wait" message
		const waitMessage = await message.reply("🍁 Please wait...");

		try {
			const response = await axios.get(apiUrl);
			const data = response.data;

			if (data.error || data.status !== 200) {
				await api.unsendMessage(waitMessage.messageID); // Unsend the waiting message
				return message.reply("Failed to fetch player information. Please check the UID and try again.");
			}

			const playerData = data.data;
			const basicInfo = playerData.basicInfo || {};
			const profileInfo = playerData.profileInfo || {};
			const clanInfo = playerData.clanBasicInfo || {};
			const socialInfo = playerData.socialInfo || {};
			const petInfo = playerData.petInfo || {};
			const creditScoreInfo = playerData.creditScoreInfo || {};

			const formattedMessage = `
**PLAYER INFO**

┌⌚ **PLAYER ACTIVITY**
├─Last Login At: ${basicInfo.lastLoginAt ? new Date(basicInfo.lastLoginAt * 1000).toLocaleString() : "N/A"}
└─Created At: ${basicInfo.createAt ? new Date(basicInfo.createAt * 1000).toLocaleString() : "N/A"}

┌💁‍♂️ **BASIC INFO**
├─Nickname: ${basicInfo.nickname || "N/A"}
├─UID: ${basicInfo.accountId || "N/A"}
├─Region: ${basicInfo.region || "N/A"}
├─Level: ${basicInfo.level || "N/A"}
├─Exp: ${basicInfo.exp || "N/A"}
├─Badge Count: ${basicInfo.badgeCnt || "N/A"}
├─Liked Count: ${basicInfo.liked || "N/A"}
└─Title ID: ${basicInfo.title || "N/A"}

┌📈 **PLAYER RANKS**
├─BR Rank Point: ${basicInfo.rankingPoints || "N/A"}
└─CS Rank Point: ${basicInfo.csRankingPoints || "N/A"}


┌🫡 **SOCIAL INFO**
├─Language: ${socialInfo.language || "N/A"}
└─Signature: ${socialInfo.signature || "N/A"}

┌👨‍👩‍👧‍👦 **GUILD INFO**
├─Guild Name: ${clanInfo.clanName || "N/A"}
├─Guild ID: ${clanInfo.clanId || "N/A"}
├─Guild Level: ${clanInfo.clanLevel || "N/A"}
└─Members/Capacity: ${clanInfo.memberNum || 0}/${clanInfo.capacity || 0}

ㅤㅤ‎‎
ㅤ


`;

			// Remove the "please wait" message
			await api.unsendMessage(waitMessage.messageID);

			const imageUrls = [];

			// Add avatar image URL (if available)
			if (basicInfo.avatars && basicInfo.avatars.length > 0) {
				imageUrls.push(basicInfo.avatars[0]); // Use the first avatar image
			}

			// Add clothes image URL (if available)
			if (profileInfo.clothes && profileInfo.clothes.images && profileInfo.clothes.images.length > 0) {
				imageUrls.push(profileInfo.clothes.images[0]); // Use the first clothes image
			}

			if (imageUrls.length === 0) {
				return message.reply(formattedMessage); // No images to send
			}

			const imagePaths = [];

			// Function to download an image and save it temporarily
			async function downloadImage(url, filename) {
				const imagePath = path.resolve(__dirname, filename);
				const imageResponse = await axios({
					url,
					method: "GET",
					responseType: "stream"
				});

				await new Promise((resolve, reject) => {
					const writer = fs.createWriteStream(imagePath);
					imageResponse.data.pipe(writer);
					writer.on("finish", resolve);
					writer.on("error", reject);
				});

				imagePaths.push(imagePath);
				return imagePath;
			}

			// Download all images from the image URLs
			for (let i = 0; i < imageUrls.length; i++) {
				await downloadImage(imageUrls[i], `temp_image_${uid}_${i}.jpg`);
			}

			// Send the message with both images as attachments
			api.sendMessage(
				{
					body: formattedMessage,
					attachment: imagePaths.map((imagePath) => fs.createReadStream(imagePath))
				},
				event.threadID,
				async () => {
					// Delete all temporary files after sending
					imagePaths.forEach((imagePath) => fs.unlinkSync(imagePath));
				},
				event.messageID
			);
		} catch (error) {
			console.error(error);
			await api.unsendMessage(waitMessage.messageID); // Remove "please wait" message if an error occurs
			message.reply("An error occurred while fetching player information.");
		}
	}
};
