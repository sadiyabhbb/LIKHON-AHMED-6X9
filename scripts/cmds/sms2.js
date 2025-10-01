module.exports = {
  config: {
    name: "sms2",
    version: "1.2",
    author: "LIKHON AHMED",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "gửi sms bằng api",
      en: "send sms using api"
    },
    description: {
      vi: "gửi sms qua 2 api cùng lúc",
      en: "send sms via 2 apis at once"
    },
    category: "tools",
    guide: {
      vi: "sms <số điện thoại> <số lượng>",
      en: "sms <phone> <amount>"
    }
  },

  langs: {
    vi: {
      missing: "vui lòng nhập số điện thoại và số lượng",
      sending: "đang gửi sms đến %1 với số lượng %2",
      result: "Kết quả:\n- smsBomv2: %1\n- smsBom: %2",
      fail: "gửi sms thất bại: %1"
    },
    en: {
      missing: "please provide phone number and amount",
      sending: "sending sms to %1 with amount %2",
      result: "Result:\n- smsBomv2: %1\n- smsBom: %2",
      fail: "sms failed: %1"
    }
  },

  onStart: async function ({ args, message, getLang }) {
    const axios = require("axios");
    const number = args[0];
    const amount = args[1];
    const key = "mahi01234497";
    const baseUrl = "https://api-hub-v2.vercel.app";

    if (!number || !amount) {
      return message.reply(getLang("missing"));
    }

    message.reply(getLang("sending", number, amount));

    const url1 = `${baseUrl}/xnil/smsbomv2?number=${encodeURIComponent(number)}&amount=${encodeURIComponent(amount)}&key=${key}`;
    const url2 = `${baseUrl}/xnil/smsbom?number=${encodeURIComponent(number)}&amount=${encodeURIComponent(amount)}&key=${key}`;

    try {
      const [res1, res2] = await Promise.allSettled([axios.get(url1), axios.get(url2)]);

      const result1 = res1.status === "fulfilled" ? JSON.stringify(res1.value.data) : res1.reason.message;
      const result2 = res2.status === "fulfilled" ? JSON.stringify(res2.value.data) : res2.reason.message;

      message.reply(getLang("result", result1, result2));
    } catch (e) {
      message.reply(getLang("fail", e.message));
    }
  }
};
