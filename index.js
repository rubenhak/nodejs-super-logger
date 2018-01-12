
exports.bunyan = function(name, enableFileOutput) {
    const Logger = require('./lib/bunyan');
    var logger = new Logger(name, enableFileOutput);
    return logger;
}
