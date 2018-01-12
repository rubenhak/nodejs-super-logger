
exports.setup = function(loggerName, name, options) {
    const Logger = require('./lib/loggers/' + loggerName);
    var logger = new Logger();
    logger.setup(name, options);
    module.exports = logger;
    return logger;
}
