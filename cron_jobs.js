const cron = require('node-cron');
const { notifyTransactions } = require('./controller/trc20-notifier.js');

const randomNotify = async() => {
    // Generate a random number of notifications between 10 and 20
    const numberOfNotifications = Math.floor(Math.random() * 11) + 10;

    for (let i = 0; i < numberOfNotifications; i++) {
        const randomHours = Math.floor(Math.random() * 24);
        const randomMinutes = Math.floor(Math.random() * 60);
        const randomMilliseconds = ((randomHours * 60) + randomMinutes) * 60 * 1000;

        setTimeout(async () => {
            await notifyTransactions({ type: 'withdraw', wallet: 'usdt' });
        }, randomMilliseconds);
    }
};

const randomPayoutNotify = async() => {
    // Generate a random number of notifications between 10 and 20
    const numberOfNotifications = Math.floor(Math.random() * 1) + 4;

    for (let i = 0; i < numberOfNotifications; i++) {
        const randomHours = Math.floor(Math.random() * 24);
        const randomMinutes = Math.floor(Math.random() * 60);
        const randomMilliseconds = ((randomHours * 60) + randomMinutes) * 60 * 1000;

        setTimeout(async () => {
            await notifyTransactions({ type: 'payout', wallet: 'usdt' });
        }, randomMilliseconds);
    }
};

// Schedule the randomNotify function to run once daily at midnight
// cron.schedule('0 0 * * *', randomNotify)
// cron.schedule('0 0 * * *', randomPayoutNotify)


const test=async()=>{
    notifyTransactions({ type: 'withdraw', wallet: 'usdt' })
}

test()


const { notifyTransactions : bep20Notify} = require('./controller/bep20-notifier.js');

(async () => {
  await bep20Notify({ type: 'withdraw', wallet: 'usdt' });
})();


module.exports = {
    randomNotify
};


