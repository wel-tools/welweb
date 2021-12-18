const chai = require('chai');
const {FULL_NODE_API} = require('../helpers/config');
const assertThrow = require('../helpers/assertThrow');
const welWebBuilder = require('../helpers/welWebBuilder');
const WelWeb = welWebBuilder.WelWeb;
const GetNowBlock = require('../helpers/GetNowBlock');
const BlockLib = require('../helpers/BlockLib');
const jlog = require('../helpers/jlog')

const assert = chai.assert;

describe('WelWeb.lib.plugin', async function () {

    let welWeb;

    before(async function () {
        welWeb = welWebBuilder.createInstance();
    });

    describe('#constructor()', function () {

        it('should have been set a full instance in welWeb', function () {

            assert.instanceOf(welWeb.plugin, WelWeb.Plugin);
        });

    });

    describe("#plug GetNowBlock into welWeb.trx", async function () {

        it('should register the plugin GetNowBlock', async function () {

            const someParameter = 'someValue'

            let result = welWeb.plugin.register(GetNowBlock, {
                someParameter
            })
            assert.isTrue(result.skipped.includes('_parseToken'))
            assert.isTrue(result.plugged.includes('getCurrentBlock'))
            assert.isTrue(result.plugged.includes('getLatestBlock'))

            result = await welWeb.trx.getCurrentBlock()
            assert.isTrue(result.fromPlugin)
            assert.equal(result.blockID.length, 64)
            assert.isTrue(/^00000/.test(result.blockID))

            result = await welWeb.trx.getSomeParameter()
            assert.equal(result, someParameter)

        })

    });

    describe("#plug BlockLib into welWeb at first level", async function () {

        it('should register the plugin and call a method using a promise', async function () {

            let result = welWeb.plugin.register(BlockLib)
            assert.equal(result.libs[0], 'BlockLib')
            result = await welWeb.blockLib.getCurrent()
            assert.isTrue(result.fromPlugin)
            assert.equal(result.blockID.length, 64)
            assert.isTrue(/^00000/.test(result.blockID))

        })

        it('should register and call a method using callbacks', async function () {

            welWeb.plugin.register(BlockLib)
            return new Promise(resolve => {
                welWeb.blockLib.getCurrent((err, result) => {
                    assert.isTrue(result.fromPlugin)
                    assert.equal(result.blockID.length, 64)
                    assert.isTrue(/^00000/.test(result.blockID))
                    resolve()
                })
            })
        })

        it('should not register if welWeb is instantiated with the disablePlugins option', async function () {

            let welWeb2 = welWebBuilder.createInstance({disablePlugins: true});
            let result = welWeb2.plugin.register(BlockLib);
            assert.isTrue(typeof result.error === 'string');

        })


    });

});
