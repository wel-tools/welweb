import WelWeb from 'index';
import utils from 'utils';
import semver from 'semver';

export default class Plugin {

    constructor(welWeb = false, options = {}) {
        if (!welWeb || !welWeb instanceof WelWeb)
            throw new Error('Expected instance of WelWeb');
        this.welWeb = welWeb;
        this.pluginNoOverride = ['register'];
        this.disablePlugins = options.disablePlugins;
    }

    register(Plugin, options) {
        let pluginInterface = {
            requires: '0.0.0',
            components: {}
        }
        let result = {
            libs: [],
            plugged: [],
            skipped: []
        }
        if (this.disablePlugins) {
            result.error = 'This instance of WelWeb has plugins disabled.'
            return result;
        }
        const plugin = new Plugin(this.welWeb)
        if (utils.isFunction(plugin.pluginInterface)) {
            pluginInterface = plugin.pluginInterface(options)
        }
        if (semver.satisfies(WelWeb.version, pluginInterface.requires)) {
            if (pluginInterface.fullClass) {
                // plug the entire class at the same level of welWeb.trx
                let className = plugin.constructor.name
                let classInstanceName = className.substring(0, 1).toLowerCase() + className.substring(1)
                if (className !== classInstanceName) {
                    WelWeb[className] = Plugin
                    this.welWeb[classInstanceName] = plugin
                    result.libs.push(className)
                }
            } else {
                // plug methods into a class, like trx
                for (let component in pluginInterface.components) {
                    if (!this.welWeb.hasOwnProperty(component)) {
                        continue
                    }
                    let methods = pluginInterface.components[component]
                    let pluginNoOverride = this.welWeb[component].pluginNoOverride || []
                    for (let method in methods) {
                        if (method === 'constructor' || (this.welWeb[component][method] &&
                            (pluginNoOverride.includes(method) // blacklisted methods
                                || /^_/.test(method)) // private methods
                        )) {
                            result.skipped.push(method)
                            continue
                        }
                        this.welWeb[component][method] = methods[method].bind(this.welWeb[component])
                        result.plugged.push(method)
                    }
                }
            }
        } else {
            throw new Error('The plugin is not compatible with this version of WelWeb')
        }
        return result
    }
}

