const axios = require("axios");

// ENV Variables
const botToken = process.env.BOT_API;
const channelId = process.env.CHANNEL_ID;
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

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

// Check system/contract/invalid addresses
const isContractOrNull = (addr) =>
  !addr ||
  addr === "0x0000000000000000000000000000000000000000" ||
  addr.startsWith("0x000");

/* -------------------------------------------
   1. Fetch Recent USDT-BEP20 Transfers (Moralis)
----------------------------------------------*/
const fetchUsdtTransactions = async () => {
  try {
    const url = `https://deep-index.moralis.io/api/v2/erc20/${USDT_BEP20}/transfers`;

    const res = await axios.get(url, {
      headers: { "X-API-Key": MORALIS_API_KEY },
      params: { chain: "bsc", limit: 100, disable_total: true },
    });

    const txs = res.data.result || [];
    if (!txs.length) return [];

    return txs
      .map((tx) => ({
        amount: Number(tx.value) / 1e18,
        from: tx.from_address?.toLowerCase(),
        to: tx.to_address?.toLowerCase(),
        hash: tx.transaction_hash,
      }))
      .filter((tx) =>
        tx.amount >= 20 && // Ignore < $20 dust
        tx.amount < 100000 && // safety
        tx.from !== tx.to && // ignore internal
        !isContractOrNull(tx.from) &&
        !isContractOrNull(tx.to)
      );

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
    const shortName = escapeMD(user.slice(0, 3) + "...");
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

  } catch (err) {
    console.error("Telegram error:", err.response?.data || err.message);
  }
};

/* -------------------------------------------------
   3. Business Logic → Realistic Amount Selection
--------------------------------------------------*/
const notifyTransactions = async ({ type, wallet }) => {
  if (wallet !== "usdt") return;

  const txs = await fetchUsdtTransactions();
  if (!txs.length) {
    console.log("No valid USDT BEP20 transfers found.");
    return;
  }

  const randomName = getName();
  let selected = null;

  if (type === "withdraw") {
    selected = txs.find((t) => t.amount >= 500 && t.amount < 3000);
  }

  if (type === "payout") {
    selected = txs.find((t) => t.amount >= 20 && t.amount < 200);
  }

  if (!selected) {
    selected = txs[Math.floor(Math.random() * txs.length)];
  }

  await sendWithdrawMessage({
    user: randomName,
    amount: selected.amount,
    hash: selected.hash,
  });
};

module.exports = {
  notifyTransactions,
  fetchUsdtTransactions,
};
