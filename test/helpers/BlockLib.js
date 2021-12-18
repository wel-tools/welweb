
const injectPromise = require('injectpromise')

class BlockLib {

    constructor(welWeb = false) {
        if (!welWeb)
            throw new Error('Expected instances of WelWeb and utils');
        this.welWeb = welWeb;
        this.injectPromise = injectPromise(this);
    }

    async getCurrent(callback = false) {

        if (!callback)
            return this.injectPromise(this.getCurrent);

        this.welWeb.fullNode.request('wallet/getnowblock').then(block => {
            block.fromPlugin = true
            callback(null, block);
        }).catch(err => callback(err));
    }

    pluginInterface() {
        return {
            requires: '^4.0.0',
            fullClass: true
        }
    }
}

module.exports = BlockLib
