const IMPLEMENTATION = 'pino'
// const IMPLEMENTATION = 'bunyan'

const RootLogger = require('./lib/root');

function createGlobal(name, options, customOptions) {
    module._globalProvider = IMPLEMENTATION;
    module._globalOptions = options;

    if (customOptions) {
        if (customOptions.provider) {
            module._globalProvider = customOptions.provider
        }
    }

    var rootLogger = new RootLogger(module._globalProvider, name, options);

    module.exports = rootLogger.logger;
    module.exports.setup = createLocal;

    return module.exports;
}

function createLocal(name, options, customOptions) {
    if (module._globalOptions) {
        options = module._globalOptions;
    }
    var provider = module._globalProvider;
    if (customOptions) {
        if (customOptions.provider) {
            provider = customOptions.provider;
        }
    }
    var rootLogger = new RootLogger(provider, name, options);
    return rootLogger.logger;
}

module.exports.setup = createGlobal;
