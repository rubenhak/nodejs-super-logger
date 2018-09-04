// "multi-write-stream": "^2.0.1",
// "pino": "^5.4.1",
// "pino-pretty": "^2.1.0",

const _ = require('the-lodash');
const Pino = require('pino');
const BaseLogger = require('../base');
const multi = require('multi-write-stream');
const fs = require('fs');

class PinoLogger extends BaseLogger
{
    constructor(root)
    {
        super(root, {
            'error' : 'error',
            'warn' : 'warn',
            'info' : 'info',
            'verbose' : 'debug',
            'debug' : 'debug',
            'silly' : 'trace'
        });
    }

    _init()
    {
        var pinoOptions = {
            name: this._name
        }

        if (this._options.pretty) {
            pinoOptions.prettyPrint = {
                levelFirst: false,
                translateTime: true
            }
            pinoOptions.prettifier = require('pino-pretty')
        }

        if (this._logFile) {
            this._log = Pino(pinoOptions, this._getOutputStream());
        } else {
            this._log = Pino(pinoOptions);
        }
    }

    _getOutputStream() {
        var logFileStream = fs.createWriteStream(this._logFile);
        var stream = multi([
            process.stdout,
            logFileStream
        ])
        return stream;
    }

    _setLevel(level)
    {
        if (!this._log) {
            return;
        }
        this._log.level = level;
    }

    _executeLog(level, args)
    {
        this._log[level].apply(this._log, args);
    }

    _setupFileStream(logFile)
    {
        // this._log.addStream({
        //     path: logFile
        // });
    }
}

module.exports = PinoLogger;
