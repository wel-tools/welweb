const assert = require('chai').assert;
const welWebBuilder = require('./welWebBuilder');

module.exports = async function (result, string) {

    assert.equal(
        result,
        welWebBuilder.getInstance().toHex(string).substring(2)
    )
}
