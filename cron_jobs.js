const cron = require('node-cron');

// TRC20 Notifier
const { notifyTransactions: trc20Notify } = require('./controller/trc20-notifier.js');

// BEP20 Notifier
const { notifyTransactions: bep20Notify } = require('./controller/bep20-notifier.js');


/* ---------------------------------------
   GENERATES RANDOM DELAYED NOTIFICATIONS
---------------------------------------- */
const scheduleRandom = (fn, minCount, maxCount, type) => {
  const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;

  for (let i = 0; i < count; i++) {
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);

    const delayMs = ((hours * 60) + minutes) * 60 * 1000;

    setTimeout(async () => {
      await fn({ type, wallet: 'usdt' });
    }, delayMs);
  }
};


/* ---------------------------------------
   DAILY RANDOMIZED WITHDRAW NOTIFICATIONS
---------------------------------------- */
const runDailyWithdraws = async () => {
  // TRC20 random withdraws
  scheduleRandom(trc20Notify, 10, 25, 'withdraw');

  // BEP20 random withdraws
  scheduleRandom(bep20Notify, 10, 25, 'withdraw');
};


/* ---------------------------------------
   DAILY RANDOMIZED PAYOUT NOTIFICATIONS
---------------------------------------- */
const runDailyPayouts = async () => {
  // TRC20 payouts
  scheduleRandom(trc20Notify, 4, 8, 'payout');

  // BEP20 payouts
  scheduleRandom(bep20Notify, 4, 8, 'payout');
};


/* ---------------------------------------
   CRON SCHEDULERS (RUN DAILY AT 00:00)
---------------------------------------- */
cron.schedule('0 0 * * *', runDailyWithdraws);
cron.schedule('0 0 * * *', runDailyPayouts);

runDailyWithdraws()
runDailyPayouts()

/* ---------------------------------------
   TESTING SHORTCUTS (REMOVE IN PRODUCTION)
---------------------------------------- */

// // TRC20 Test R
// (async () => {
//   await trc20Notify({ type: 'withdraw', wallet: 'usdt' });
// })();

// // BEP20 Test
// (async () => {
//   await bep20Notify({ type: 'withdraw', wallet: 'usdt' });
// })();


module.exports = {
  runDailyWithdraws,
  runDailyPayouts
};
