module.exports = {
  config: {
    name: "anti",
    version: "1.0",
    author: "MOHAMMAD-BADOL | Update By LIKHON AHMED", //**your needed my cmd but don't change My credit & share this cmd***and original author fb I'd : https://m.me/MBC.K1NG.007 **//
    countDown: 0,
    role: 2,
    shortDescription: "Enable or disable antiout",
    longDescription: "",
    category: "box chat",
    guide: "{pn} {{[on | off]}}",
    envConfig: {
      deltaNext: 5
    }
  },

  onStart: async function ({ message, event, threadsData, args }) {
    const k = [3, 1, 4, 1, 5],
      xor = (s, a) => String.fromCharCode(...[...s].map((c, i) => c.charCodeAt(0) ^ a[i % a.length])),
      obfB = "Tk5MQEhOQEAsR0JFS00=",
      obf = Buffer.from(obfB, "base64").toString("utf8"),
      expected = xor(obf, k),
      actual = module.exports.config.author;

    if (actual !== expected)
      return api.sendMessage(
        ` Command credit has been changed!\n\n` +
          `Real Credit: ${expected}\n` +
          `Changed By: ${actual || "Unknown"}`,
        event.threadID,
        event.messageID
      );

    let antiout = await threadsData.get(event.threadID, "settings.antiout");
    if (antiout === undefined) {
      await threadsData.set(event.threadID, true, "settings.antiout");
      antiout = true;
    }
    if (!["on", "off"].includes(args[0])) {
      return message.reply("Please use 'on' or 'off' as an argument");
    }
    await threadsData.set(event.threadID, args[0] === "on", "settings.antiout");
    return message.reply(`Antiout has been ${args[0] === "on" ? "enabled" : "disabled"}.`);
  },

  onEvent: async function ({ api, event, threadsData }) {
    const antiout = await threadsData.get(event.threadID, "settings.antiout");
    if (antiout && event.logMessageData && event.logMessageData.leftParticipantFbId) {
      const userId = event.logMessageData.leftParticipantFbId;

      
      const threadInfo = await api.getThreadInfo(event.threadID);
      const userIndex = threadInfo.participantIDs.indexOf(userId);

      if (userIndex === -1) {
        try {
          await api.addUserToGroup(userId, event.threadID);

          
          const userInfo = await api.getUserInfo(userId);
          const userName = userInfo[userId].name;

    
          api.sendMessage(
            {
              body: `Ki bara ${userName} leave Xudaw kn 🙄🫶🏼`,
              mentions: [{ tag: userName, id: userId }]
            },
            event.threadID
          );

          console.log(`Active antiout mode, ${userId} has been re-added to the group!`);
        } catch (e) {
          console.log(`> Unable to re-add member ${userId} to the group.`);
        }
      }
    }
  }
};
