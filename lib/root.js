const fs = require('fs');
const del = require('delete');

class RootLogger
{
    constructor(provider, name, options)
    {
        this._provider = provider;
        this._subloggers = {};
        this._rootName = name;
        this._rootOptions = options;

        this._setupOutputDir();

        this._rootLogger = this.sublogger(name);
    }

    _setupOutputDir()
    {
        var dir = 'logs';
        if (this._rootOptions.path) {
            dir = this._rootOptions.path;
        }
        if (this._rootOptions.cleanOnStart) {
            var toDelete = dir + '/*';
            del.sync([toDelete]);
        }
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        this._rootDir = dir;
    }

    get rootDir() {
        return this._rootDir;
    }

    get logger() {
        return this._rootLogger;
    }

    sublogger(name)
    {
        if (name in this._subloggers) {
            return this._subloggers[name];
        }

        var logger = this._create(name);

        this._subloggers[name] = logger;

        return logger;
    }

    _create(name)
    {
        const Logger = require('./loggers/' + this._provider);
        var logger = new Logger(this);
        // if (this.logger) {
        //     logger.level = this.logger.level;
        // }
        logger.setup(name, this._rootOptions);
        return logger;
    }

}

module.exports = RootLogger;
