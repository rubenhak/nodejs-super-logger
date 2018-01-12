const RootLogger = require('./lib/root');

exports.setup = function(provider, name, options) {
    const rrr = new RootLogger(provider, name, options);
    module.exports = rrr.logger;
    return rrr.logger;
}
