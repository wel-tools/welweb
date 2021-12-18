import WelWeb from 'welweb';
import Config from '../config';

import { BigNumber, openTransModal, setTransactionsData, randomSleep, myLocal } from './helper';

const chain = Config.chain;

const DATA_LEN = 64;
export const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
const privateKey = chain.privateKey;

const mainchain = new WelWeb({
  fullHost: chain.fullHost,
  privateKey
});

export const triggerSmartContract = async (address, functionSelector, options = {}, parameters = []) => {
  try {
    const welweb = window.welWeb;
    const transaction = await welweb.transactionBuilder.triggerSmartContract(
      address,
      functionSelector,
      Object.assign({ feeLimit: 20 * 1e6 }, options),
      parameters
    );

    if (!transaction.result || !transaction.result.result) {
      throw new Error('Unknown trigger error: ' + JSON.stringify(transaction.transaction));
    }
    return transaction;
  } catch (error) {
    throw new Error(error);
  }
};

export const sign = async transaction => {
  try {
    const welweb = window.welWeb;
    const signedTransaction = await welweb.trx.sign(transaction.transaction);
    return signedTransaction;
  } catch (error) {
    console.log(error, 'signerr');
    throw new Error(error);
  }
};

export const sendRawTransaction = async signedTransaction => {
  try {
    const welweb = window.welWeb;
    const result = await welweb.trx.sendRawTransaction(signedTransaction);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const view = async (address, functionSelector, parameters = [], isDappWelWeb = true) => {
  try {
    let welweb = mainchain;
    if (!isDappWelWeb && window.welWeb && window.welWeb.ready) {
      welweb = window.welWeb;
    }
    const result = await welweb.transactionBuilder.triggerSmartContract(
      address,
      functionSelector,
      { _isConstant: true },
      parameters
    );
    return result && result.result ? result.constant_result : [];
  } catch (error) {
    console.log(`view error ${address} - ${functionSelector}`, error.message ? error.message : error);
    return [];
  }
};

export const getTrxBalance = async (address, isDappWelWeb = false) => {
  try {
    let welWeb = mainchain;
    if (!isDappWelWeb && window.welWeb && window.welWeb.ready) {
      welWeb = window.welWeb;
    }
    const balance = await welWeb.trx.getBalance(address);
    return {
      balance: BigNumber(balance).div(Config.defaultPrecision),
      success: true
    };
  } catch (err) {
    console.log(`getPairBalance: ${err}`, address);
    return {
      balance: BigNumber(0),
      success: false
    };
  }
};

export const getTransactionInfo = tx => {
  const welWeb = mainchain;
  return new Promise((resolve, reject) => {
    welWeb.trx.getConfirmedTransaction(tx, (e, r) => {
      if (!e) {
        resolve(r);
      } else {
        reject(e, null);
      }
    });
  });
};

export const getTRC20Balance = async (tokenAddress, userAddress) => {
  console.log('params of getbalance: ', userAddress, tokenAddress);
  const result = await view(tokenAddress, 'balanceOf(address)', [{ type: 'address', value: userAddress }]);
  let value = BigNumber(0);
  let success = false;

  if (result.length) {
    value = new BigNumber(result[0].slice(0, DATA_LEN), 16);
    success = true;
  }

  return {
    value,
    success
  };
};
