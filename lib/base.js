const _ = require('lodash');
const path = require('path');

class BaseLogger
{
    constructor(root, levelsMap)
    {
        this._root = root;
        this._level = null;
        this._levelsMap = levelsMap;
        this._logLevels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];
    }

    get level() {
        return _level;
    }

    set level(newLevel) {
        var targetLevel = this._levelsMap[newLevel];
        this._setLevel(targetLevel);
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
        this.level = 'info';
    }

    sublogger(name)
    {
        return this._root.sublogger(name);
    }

    _setupFileOutput()
    {
        var dir = this._root.rootDir;
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
            // console.log('FROM: ' + this._name + ' DATA: ' + args);
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
    //
    // _setupSublogger(name, level)
    // {
    //     console.log('BASE _setupSublogger: ' + name);
    // }
}

module.exports = BaseLogger;
