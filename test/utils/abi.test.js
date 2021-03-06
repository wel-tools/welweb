const chai = require('chai');
const {ADDRESS_HEX, ADDRESS_BASE58} = require('../helpers/config');
const welWebBuilder = require('../helpers/welWebBuilder');

const assert = chai.assert;

describe('WelWeb.utils.abi', function () {

    describe('#decodeParams()', function () {
        it('should decode abi coded params passing types and output', function () {

            const welWeb = welWebBuilder.createInstance();
            const types = ['string', 'string', 'uint8', 'bytes32', 'uint256'];
            const output = '0x00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000012dc03b7993bad736ad595eb9e3ba51877ac17ecc31d2355f8f270125b9427ece700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011506920446179204e30306220546f6b656e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035049450000000000000000000000000000000000000000000000000000000000';

            const expected = [
                'Pi Day N00b Token',
                'PIE',
                18,
                '0xdc03b7993bad736ad595eb9e3ba51877ac17ecc31d2355f8f270125b9427ece7',
                0
            ];


            const result = welWeb.utils.abi.decodeParams(types, output);

            for(let i = 0; i < expected.length; i++) {
                assert.equal(result[i], expected[i]);
            }
        });

        it('should decode abi coded params passing names, types and output', function () {

            const welWeb = welWebBuilder.createInstance();
            const names = ['Token', 'Graph', 'Qty', 'Bytes', 'Total'];
            const types = ['string', 'string', 'uint8', 'bytes32', 'uint256'];
            const output = '0x00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000012dc03b7993bad736ad595eb9e3ba51877ac17ecc31d2355f8f270125b9427ece700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011506920446179204e30306220546f6b656e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035049450000000000000000000000000000000000000000000000000000000000';

            const expected = {
                Token: 'Pi Day N00b Token',
                Graph: 'PIE',
                Qty: 18,
                Bytes: '0xdc03b7993bad736ad595eb9e3ba51877ac17ecc31d2355f8f270125b9427ece7',
                Total: 0
            };

            const result = welWeb.utils.abi.decodeParams(names, types, output);
            for(let i in expected) {
                assert.equal(result[i], expected[i]);
            }
        });

        it('should throw if the string does not start with 0x', function () {

            const welWeb = welWebBuilder.createInstance();
            const types = ['string', 'string', 'uint8', 'bytes32', 'uint256'];
            const output =
                '00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000012dc03b7993bad736ad595eb9e3ba51877ac17ecc31d2355f8f270125b9427ece700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011506920446179204e30306220546f6b656e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035049450000000000000000000000000000000000000000000000000000000000';
            assert.throws(() => {
                welWeb.utils.abi.decodeParams(types, output)
            }, 'invalid arrayify value');
        });

        it('should throw if the output format is wrong', function () {

            const welWeb = welWebBuilder.createInstance();
            const types = ['string', 'string', 'uint8', 'bytes32', 'uint256'];
            const output = '0x00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000012dc03b7993bad736ad595eb9e3ba51877ac17ecc31d2355f8f270125b9427ece700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011506920446179204e30306220546f6b656e0000000000000000000000000000005049450000000000000000000000000000000000000000000000000000000000';

            assert.throws(() => {
                welWeb.utils.abi.decodeParams(types, output)
            }, 'overflow');
        });

        it('should throw if the output is invalid', function () {

            const welWeb = welWebBuilder.createInstance();
            const types = ['string'];
            const output = '0x6630f88f000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000046173646600000000000000000000000000000000000000000000000000000000';

            assert.throws(() => {
                welWeb.utils.abi.decodeParams(types, output)
            }, 'The encoded string is not valid. Its length must be a multiple of 64.');
        });

        it('should decode if the output is prefixed with the method hash', function () {

            const welWeb = welWebBuilder.createInstance();
            const types = ['string'];
            const output = '0x6630f88f000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000046173646600000000000000000000000000000000000000000000000000000000';

            const result = welWeb.utils.abi.decodeParams(types, output, true)
            assert.equal(result, 'asdf')
        });
    });


    describe('#encodeParams()', function () {
        it('should encode abi coded params passing types and values', function () {

            const welWeb = welWebBuilder.createInstance();
            const types = ['string', 'string', 'uint8', 'bytes32', 'uint256'];
            const values = [
                'Pi Day N00b Token',
                'PIE',
                18,
                '0xdc03b7993bad736ad595eb9e3ba51877ac17ecc31d2355f8f270125b9427ece7',
                0
            ];

            const expected = '0x00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000012dc03b7993bad736ad595eb9e3ba51877ac17ecc31d2355f8f270125b9427ece700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011506920446179204e30306220546f6b656e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035049450000000000000000000000000000000000000000000000000000000000';


            const result = welWeb.utils.abi.encodeParams(types, values);

            for(let i = 0; i < expected.length; i++) {
                assert.equal(result[i], expected[i]);
            }
        });

        it('should encode abi coded params passing addresses in hex and base58 mode', function () {

            const welWeb = welWebBuilder.createInstance();
            const types = ['string', 'address', 'address'];
            const values = [
                'Onwer',
                ADDRESS_HEX,
                ADDRESS_BASE58
            ];

            const expected = '0x0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000928c9af0651632157ef27a2cf17ca72c575a4d21000000000000000000000000928c9af0651632157ef27a2cf17ca72c575a4d2100000000000000000000000000000000000000000000000000000000000000054f6e776572000000000000000000000000000000000000000000000000000000';
            const result = welWeb.utils.abi.encodeParams(types, values);

            for(let i = 0; i < expected.length; i++) {
                assert.equal(result[i], expected[i]);
            }
        });
    });
});
