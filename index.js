
exports.setup = function(loggerName, name, enableFileOutput) {
    const Logger = require('./lib/loggers/' + loggerName);
    var logger = new Logger(name, enableFileOutput);
    module.exports = logger;
    return logger;
}
