const _ = require('the-lodash');
const path = require('path');
const fs = require('fs');

class BaseLogger
{
    constructor(root, levelsMap)
    {
        this._root = root;
        this._parent = null;
        this._subloggers = [];
        this._level = null;
        this._levelsMap = levelsMap;
        this._logLevels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];
    }

    get actualLevel() {
        if (this._level) {
            return this._level;
        }
        if (this._parent) {
            return this._parent.activeLevel;
        }
        return 'info';
    }

    get level() {
        return this._level;
    }

    set level(newLevel) {
        this._level = newLevel;
        this._setCurrentLevel();
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

        this._setCurrentLevel();
    }

    outputStream(fileName)
    {
        if (!this._root._rootOptions.enableFile) {
            return null;
        }

        var filePath = path.join(this._root.rootDir, fileName);
        var writer = fs.createWriteStream(filePath);

        var wrapper = {
            _indent: 0,
            write: (str) => {
                if (_.isNotNullOrUndefined(str)) {
                    if (_.isObject(str)) {
                        for (var x of JSON.stringify(str, null, 4).split('\n'))
                        {
                            writer.write('    '.repeat(wrapper._indent));
                            writer.write(x);
                            writer.write('\n');
                        }
                    } else {
                        writer.write('    '.repeat(wrapper._indent));
                        writer.write(str);
                        writer.write('\n');
                    }
                }
            },
            writeHeader: (str) => {
                return wrapper.writer('**** ' + str);
            },
            indent: () => {
                wrapper._indent++;
            },
            unindent: () => {
                wrapper._indent--;
            },
            close: () => {
                return new Promise((resolve, reject) => {
                    writer.end();
                    writer.on('error', (err) => {
                        reject(err);
                    });
                    writer.end(null, null, () => {
                        resolve();
                    });
                });
            }
        }
        return wrapper;
    }

    outputFile(fileName, contents)
    {
        var writer = this.outputStream(fileName);
        if (!writer) {
            return Promise.resolve();
        }
        writer.write(contents);
        return writer.close();
    }

    _setParent(parent)
    {
        this._parent = parent;
        this._parent._subloggers.push(this);
        this._setCurrentLevel();
    }

    _setCurrentLevel()
    {
        var targetLevel = this._levelsMap[this.actualLevel];
        if (targetLevel) {
            this._setLevel(targetLevel);
        }
        for(var sublogger of this._subloggers)
        {
            sublogger._setCurrentLevel();
        }
    }

    sublogger(name)
    {
        var logger = this._root.sublogger(name);
        logger._setParent(this);
        return logger;
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
