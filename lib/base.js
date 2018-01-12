const _ = require('lodash');
const fs = require('fs');
const path = require('path');

class BaseLogger
{
    constructor(name, enableFileOutput, levelsMap)
    {
        this._name = name;
        this._levelsMap = levelsMap;
        this._logLevels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];

        this._init();
        this._setupLevels();
        if (enableFileOutput) {
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
        if (!fs.existsSync(dir)){
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
