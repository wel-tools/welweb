const welWebBuilder = require('../helpers/welWebBuilder');

module.exports = async function (func, pk, transaction) {
    const welWeb = welWebBuilder.createInstance();
    if( !transaction) {
        transaction = await func;
    }
    const signedTransaction = await welWeb.trx.sign(transaction, pk);
    const result = {
        transaction,
        signedTransaction,
        receipt: await welWeb.trx.sendRawTransaction(signedTransaction)
    };
    return Promise.resolve(result);
}
