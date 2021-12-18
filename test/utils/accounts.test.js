const chai = require('chai');
const {ADDRESS_HEX, ADDRESS_BASE58} = require('../helpers/config');
const welWebBuilder = require('../helpers/welWebBuilder');

const assert = chai.assert;

describe('WelWeb.utils.accounts', function () {

    describe('#generateAccount()', function () {

        it("should generate a new account", async function () {
            const welWeb = welWebBuilder.createInstance();

            const newAccount = await welWeb.utils.accounts.generateAccount();
            assert.equal(newAccount.privateKey.length, 64);
            assert.equal(newAccount.publicKey.length, 130);
            let address = welWeb.address.fromPrivateKey(newAccount.privateKey);
            assert.equal(address, newAccount.address.base58);

            assert.equal(welWeb.address.toHex(address), newAccount.address.hex.toLowerCase());
        });
    });
});
