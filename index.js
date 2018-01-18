const RootLogger = require('./lib/root');

function createGlobal(provider, name, options) {
    module._globalProvider = provider;
    module._globalOptions = options;

    var rootLogger = new RootLogger(provider, name, options);

    module.exports = rootLogger.logger;
    module.exports.setup = createLocal;

    return module.exports;
}

function createLocal(provider, name, options) {
    if (module._globalProvider) {
        provider = module._globalProvider;
    }
    if (module._globalOptions) {
        options = module._globalOptions;
    }
    var logger = new RootLogger(provider, name, options);
    return logger;
}

module.exports.setup = createGlobal;
