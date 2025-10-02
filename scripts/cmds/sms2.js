module.exports = {
  config: {
    name: "sms2",
    version: "1.3",
    author: "LIKHON AHMED",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "send sms using api"
    },
    description: {
      en: "send sms via 2 apis at once"
    },
    category: "tools",
    guide: {
      en: "sms <phone> <amount>"
    }
  },

  langs: {
    en: {
      missing: "please provide phone number and amount",
      sending: "sending sms to %1 with amount %2",
      result: "Result:\n%1",
      fail: "sms failed: %1"
    }
  },

  onStart: async function ({ args, message, getLang }) {
    const axios = require("axios");
    const number = args[0];
    const amount = args[1];
    const key = "fx285329";
    const baseUrl = "https://api-hub-v2.vercel.app";

    if (!number || !amount) {
      return message.reply(getLang("missing"));
    }

    // ফোন নাম্বার লুকানো শেষ 6 সংখ্যার জন্য
    function maskNumber(num) {
      if (num.length <= 6) return "*".repeat(num.length);
      return num.slice(0, num.length - 6) + "******";
    }

    message.reply(getLang("sending", maskNumber(number), amount));

    const url1 = `${baseUrl}/xnil/smsbomv2?number=${encodeURIComponent(number)}&amount=${encodeURIComponent(amount)}&key=${key}`;
    const url2 = `${baseUrl}/xnil/smsbom?number=${encodeURIComponent(number)}&amount=${encodeURIComponent(amount)}&key=${key}`;

    try {
      const [res1, res2] = await Promise.allSettled([axios.get(url1), axios.get(url2)]);

      const result1 = res1.status === "fulfilled" ? res1.value.data : { error: res1.reason.message };
      const result2 = res2.status === "fulfilled" ? res2.value.data : { error: res2.reason.message };

      // JSON আকারে সুন্দরভাবে দেখানো
      const output = {
        phone: maskNumber(number),
        amount: amount,
        apis: {
          smsBomv2: result1,
          smsBom: result2
        }
      };

      message.reply(getLang("result", JSON.stringify(output, null, 2)));
    } catch (e) {
      message.reply(getLang("fail", e.message));
    }
  }
};
