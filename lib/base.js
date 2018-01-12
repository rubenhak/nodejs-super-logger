const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const del = require('delete');

class BaseLogger
{
    constructor(levelsMap)
    {
        this._levelsMap = levelsMap;
        this._logLevels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];
    }

    setup(name, options)
    {
        this._name = name;
        this._options = options;

        this._init();
        this._setupLevels();
        if (this._options.enableFile) {
            this._setupFileOutput();
        }
        this.info('Logger initialized.');
    }

    level(newLevel)
    {
        var targetLevel = this._levelsMap[newLevel];
        this._setLevel(targetLevel);
    }

    _setupFileOutput()
    {
        var dir = 'logs';
        if (this._options.path) {
            dir = this._options.path;
        }
        if (this._options.cleanOnStart) {
            var toDelete = dir + '/*';
            del.sync([toDelete]);
        }
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        var logFile = path.join(dir, this._name + '.log');
        this._setupFileStream(logFile);
    }

    _setupLevels()
    {
        for(var level of this._logLevels)
        {
            this._setupLevel(level);
        }
        this['exception'] = (...args) => {
            this._executeLog('error', args);
        };
    }

    _setupLevel(level)
    {
        var targetLevel = this._levelsMap[level];
        this[level] = (...args) => {
            this._executeLog(targetLevel, args);
        };
    }

    _init()
    {
        console.log('BASE _init');
    }

    _setLevel(level)
    {
        console.log('BASE setLevel: ' + level);
    }

    _executeLog(level, args)
    {
        console.log('BASE executeLog');
        console.log('executeLog, arguments:' + JSON.stringify(arguments));
        console.log('executeLog, level:' + level);
        console.log('executeLog, args:' + JSON.stringify(args));
    }

    _setupFileStream(logFile)
    {
        console.log('BASE _setupFileStream: ' + logFile);
    }
}

module.exports = BaseLogger;
