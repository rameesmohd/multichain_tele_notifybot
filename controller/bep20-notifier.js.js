const axios = require("axios");

// ENV Variables
const botToken = process.env.BOT_API;
const channelId = process.env.CHANNEL_ID;
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const MAIN_SERVER = process.env.MAIN_SERVER_URL;

// Token Contract
const USDT_BEP20 = "0x55d398326f99059ff775485246999027b3197955";

// Helper functions
const { getRandomCountryByName, names } = require("./helper");

// Escape MarkdownV2 for Telegram
const escapeMD = (text) =>
  String(text).replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");

// Shorten txid
const shortTx = (tx) =>
  tx.length <= 20 ? tx : `${tx.slice(0, 10)}...${tx.slice(-10)}`;

// Pick random user name
const getName = () => {
  const list = names.en;
  return list[Math.floor(Math.random() * list.length)];
};

/* -------------------------------------------
   1. Fetch Recent USDT-BEP20 Transfers (Moralis)
----------------------------------------------*/
const fetchUsdtTransactions = async () => {
  try {
    const url = `https://deep-index.moralis.io/api/v2/erc20/${USDT_BEP20}/transfers`;

    const res = await axios.get(url, {
      headers: { "X-API-Key": MORALIS_API_KEY },
      params: { chain: "bsc", limit: 50 },
    });

    const txs = res.data.result || [];
    if (!txs.length) return [];

    return txs.map((tx) => ({
      amount: Number(tx.value) / 1e18,
      from: tx.from_address,
      to: tx.to_address,
      hash: tx.transaction_hash,
    }));
  } catch (err) {
    console.error("Moralis error:", err.message);
    return [];
  }
};

/* -------------------------------------------
   2. Send Telegram Notification (Business Style)
----------------------------------------------*/
const sendWithdrawMessage = async ({ user, amount, hash }) => {
  try {
     const shortName = escapeMD(
      user.length > 3 ? user.slice(0, 3) + "..." : user
    );
    const amountStr = amount.toFixed(2).replace(/\./g, "\\.");
    const txid = escapeMD(shortTx(hash));
    const explorer = `https://bscscan.com/tx/${hash}`;

    const caption =
      `*📤 Withdrawal Confirmation*\n\n` +
      `*Amount:* *\\$${amountStr}*\n` +
      `*Client:* ${shortName}\n` +
      `*Network:* Binance Smart Chain \\(BEP\\-20\\)\n\n` +
      `*Transaction Reference:*\n` +
      `[${txid}](${explorer})\n\n` +
      `_Your withdrawal has been successfully processed and recorded on the blockchain\\._`;

    await axios.post(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      chat_id: channelId,
      photo:
        "https://res.cloudinary.com/dj5inosqh/image/upload/v1763743224/2_acbqp7.png",
      caption,
      parse_mode: "MarkdownV2",
    });

    // OPTIONAL – send details to main server
    // await addToServer({ user, amount, hash });

  } catch (err) {
    console.error("Telegram error:", err.response?.data || err.message);
  }
};

/* -------------------------------------------------
   3. Simple Business Logic → pick a valid transaction
--------------------------------------------------*/
const notifyTransactions = async ({ type, wallet }) => {
  if (wallet !== "usdt") return;

  const txs = await fetchUsdtTransactions();
  if (!txs.length) {
    console.log("No BEP20 transactions found.");
    return;
  }

  const randomName = getName();

  let selected;

  if (type === "withdraw") {
    selected =
      txs.find((t) => t.amount >= 500 && t.amount < 3000 && t.amount % 5 !== 0) ||
      txs[0];
  }

  if (type === "payout") {
    selected = txs.find((t) => t.amount >= 20 && t.amount < 200);
  }

  if (!selected) return;

  await sendWithdrawMessage({
    user: randomName,
    amount: selected.amount,
    hash: selected.hash,
  });
};

// Export functions
module.exports = {
  notifyTransactions,
  fetchUsdtTransactions,
};
