const RootLogger = require('./lib/root');

exports.setup = function(provider, name, options) {
    const root = new RootLogger(provider, name, options);
    module.exports = root.logger;
    return root.logger;
}
