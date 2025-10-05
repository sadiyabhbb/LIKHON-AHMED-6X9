module.exports = {
  config: {
    name: "gcadmin",
    version: "1.2",
    author: "MOHAMMAD-BADOL | LIKHON AHMED",
    role: 2,
    category: "group",
    shortDescription: "Manage group admins",
    longDescription: "Add, remove, or list group admins using UID, tag, or reply.",
    guide: "{pn} [add/remove/list] <uid | tag | reply>"
  },

  onStart: async function ({ api, event, args }) {
    try {
      const threadID = event.threadID;
      const action = args[0]?.toLowerCase();

      if (!["add", "remove", "list"].includes(action)) {
        return api.sendMessage(
          "⚙ Use:\n/gcadmin add <uid | tag | reply>\n/gcadmin remove <uid | tag | reply>\n/gcadmin list",
          threadID,
          event.messageID
        );
      }

      
      if (action === "list") {
        const info = await api.getThreadInfo(threadID);
        const admins = info.adminIDs || [];

        if (admins.length === 0) {
          return api.sendMessage("❌ No admins found in this group.", threadID, event.messageID);
        }

        let msg = "👑 Group Admin List:\n\n";
        const userInfo = await api.getUserInfo(admins.map(a => a.id));

        admins.forEach((a, index) => {
          const name = userInfo[a.id]?.name || "Unknown User";
          msg += `${index + 1}. ${name}\nUID: ${a.id}\n\n`;
        });

        return api.sendMessage(msg, threadID, event.messageID);
      }

      let targetID;

      
      if (event.messageReply) {
        targetID = event.messageReply.senderID;
      }
    
      else if (Object.keys(event.mentions).length > 0) {
        targetID = Object.keys(event.mentions)[0];
      }
     
      else if (args[1]) {
        targetID = args[1].replace(/[^0-9]/g, "");
      }

      if (!targetID) {
        return api.sendMessage(
          "⚠ Please reply, tag or provide UID of the user.",
          threadID,
          event.messageID
        );
      }

      
      const isAdd = action === "add";
      await api.changeAdminStatus(threadID, targetID, isAdd);

      const info = await api.getUserInfo(targetID);
      const name = info[targetID]?.name || "Unknown User";

      return api.sendMessage(
        {
          body: isAdd
            ? `✅ ${name} LewRa ck de Admin Dichi🫡`
            : `⚠ ${name} Bara Admin Thaika Tore Kick Diche 😒`,
          mentions: [{ tag: name, id: targetID }]
        },
        threadID
      );
    } catch (error) {
      console.error(error);
      return api.sendMessage(
        "❌ Failed to process request! Make sure the bot is admin and the UID is valid.",
        event.threadID,
        event.messageID
      );
    }
  }
};
