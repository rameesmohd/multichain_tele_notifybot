// ---------------------------------------------
// TRC20 Withdrawal / Payout Notification System
// Clean, Simplified & Easy-to-Understand Version
// ---------------------------------------------

const axios = require("axios");

const botToken = process.env.BOT_API;
const channelId = process.env.CHANNEL_ID;
const MAIN_SERVER = process.env.MAIN_SERVER_URL;

const TRC20_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
const { getRandomCountryByName, names } = require("./helper");


// ---------------------------------------------
//  Escape Telegram MarkdownV2 characters 
// ---------------------------------------------
const escapeMD = (text) =>
  String(text).replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");


// ---------------------------------------------
//  Format TxID (shortened style)
// ---------------------------------------------
const shortTx = (tx) =>
  tx.length <= 20 ? tx : `${tx.slice(0, 10)}...${tx.slice(-10)}`;


// ---------------------------------------------
//  Push withdrawal to your backend (optional)
// ---------------------------------------------
const addToWithdrawList = async ({ transaction, user, amount }) => {
  try {
    await axios.post(
      `${MAIN_SERVER}/admin/withdrawal`,
      {
        formValue: {
          txnId: transaction,
          name: user,
          country: getRandomCountryByName(user),
          amount: amount.toFixed(2),
        },
      }
    );
  } catch (err) {
    console.error("Add withdrawal error:", err.message);
  }
};


// ---------------------------------------------
//  Send Telegram Notification
// ---------------------------------------------
const sendWithdrawMessage = async ({ user, amount, transaction }) => {
  try {
    const shortName = escapeMD(
      user.length > 3 ? user.slice(0, 3) + "..." : user
    );
    const amountStr = amount.toFixed(2).replace(/\./g, "\\.");
    const txShort = escapeMD(shortTx(transaction));
    const explorer = `https://tronscan.org/#/transaction/${transaction}`;

    const caption =
      `*📤 Withdrawal Confirmation*\n\n` +
      `*Amount:* *\\$${amountStr}*\n` +
      `*Client:* ${shortName}\n` +
      `*Network:* TRON \\(TRC\\-20\\)\n\n` +
      `*Transaction Reference:*\n` +
      `[${txShort}](${explorer})\n\n` +
      `_Your withdrawal has been successfully processed and recorded on the blockchain\\._`;

    await axios.post(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      chat_id: channelId,
      photo:
        "https://res.cloudinary.com/dj5inosqh/image/upload/v1763743019/1_fso93d.png",
      caption,
      parse_mode: "MarkdownV2",
    });

    // Optional:
    // await addToWithdrawList({ transaction, user, amount });

  } catch (err) {
    console.error("Telegram send error:", err.response?.data || err.message);
  }
};


// ---------------------------------------------
//  Fetch Global TRC20 USDT Transactions
// ---------------------------------------------
const fetchUsdtTransactions = async () => {
  try {
    const url = `https://api.tronscan.org/api/token_trc20/transfers?limit=50&start=0&contract_address=${TRC20_CONTRACT}`;
    const res = await axios.get(url);

    const txs = res.data?.token_transfers || [];
    if (!txs.length) return [];

    // Filter only realistic amounts
    return txs
      .map((tx) => ({
        amount: parseFloat(tx.quant) / 1e6,
        hash: tx.transaction_id,
      }))
      .filter((t) => t.amount >= 100 && t.amount <= 10000);

  } catch (err) {
    console.error("Error fetching TRC20 transfers:", err.message);
    return [];
  }
};


// ---------------------------------------------
//  Pick random realistic user name
// ---------------------------------------------
const getRandomName = () => {
  const list = names.en;
  return list[Math.floor(Math.random() * list.length)];
};


// ---------------------------------------------
//  Main Logic: Notify Withdraw or Payout
// ---------------------------------------------
const notifyTransactions = async ({ type, wallet }) => {
  if (wallet !== "usdt") return;

  const user = getRandomName();
  const txs = await fetchUsdtTransactions();
  if (!txs.length) {
    console.log("No TRC20 transactions available.");
    return;
  }

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
    user,
    amount: selected.amount,
    transaction: selected.hash,
  });
};


// ---------------------------------------------
//  Export for use
// ---------------------------------------------
module.exports = {
  notifyTransactions,
  fetchUsdtTransactions,
};
