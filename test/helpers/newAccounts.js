const welWebBuilder = require('./welWebBuilder');
const welWeb = welWebBuilder.createInstance();

const amount = process.argv[2] || 10;

(async function () {
    await welWebBuilder.newTestAccounts(amount)
})()

