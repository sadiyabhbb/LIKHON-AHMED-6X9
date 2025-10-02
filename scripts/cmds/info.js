const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "info",
    aliases: ["inf", "in4"],
    version: "2.0",
    author: "nirob | Update By LIKHON AHMED",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Sends information about the bot and admin with custom image."
    },
    category: "Information"
  },

  onStart: async function ({ message, api }) {
    await this.sendInfo(message, api);
  },

  onChat: async function ({ event, api }) {
    const body = (event.body || "").toLowerCase();
    if (body === "/info" || body === "info") {
      await this.sendInfo(event, api);
    }
  },

  sendInfo: async function (messageObj, api) {
    const botName = " 𝐋𝐢𝐤𝐡𝐨𝐧 𝐀𝐡𝐦𝐞𝐝 ꨄ︎ ";
    const botPrefix = "/";
    const authorName = "𝐋𝐢𝐤𝐡𝐨𝐧";
    const authorFB = "NOPE 🐸";
    const authorInsta = "𝐡𝐞𝐡𝐞";
    const status = "𝐋𝐚𝐯 𝐥𝐨𝐬 𝐧𝐚𝐢 🙂";

    const profilePic = "https://drive.google.com/uc?export=view&id=1Xp4uUP5DSB32kVvAS5t_RanTYdM4ZfU2";

    const now = moment().tz('Asia/Dhaka');
    const time = now.format('h:mm:ss A');

    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const uptimeString = `${hours}h ${minutes}m ${seconds}sec`;

    const messageBody = `╭────────────◊
├‣ 𝐁𝐨𝐭 & 𝐎𝐰𝐧𝐞𝐫 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧 
├‣ 𝐍𝐚𝐦𝐞: ${authorName}
├‣ 𝐁𝐨𝐭 𝐍𝐚𝐦𝐞: ${botName}
├‣ 𝐏𝐫𝐞𝐟𝐢𝐱: ${botPrefix}
├‣ 𝐅𝐛: ${authorFB}
├‣ 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦: ${authorInsta}
├‣ 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩: ${status}   
├‣ 𝐓𝐢𝐦𝐞: ${time}
├‣ 𝐔𝐩𝐭𝐢𝐦𝐞: ${uptimeString}
╰────────────◊`;

    await api.sendMessage({
      body: messageBody,
      attachment: await global.utils.getStreamFromURL(profilePic)
    }, messageObj.threadID || messageObj.senderID);
  }
};
