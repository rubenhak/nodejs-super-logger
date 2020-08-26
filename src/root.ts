
import { existsSync as fsExistsSync, mkdirSync as fsMkdirSync } from 'fs';
import { emptyDirSync } from 'fs-extra/lib/empty';

import { ILogger } from './ilogger';
import { Options } from './options';
import { PinoLogger } from './loggers/pino';

class RootLogger
{
    private _subloggers : Record<string, PinoLogger> = {};
    private _rootLogger : ILogger;
    private _rootOptions : Options;
    private _rootDir: string | null = null;

    constructor(name: string, options?: Options)
    {
        if (options) {
            this._rootOptions = options;    
        } else {
            this._rootOptions = new Options();
        }

        this._setupOutputDir();

        this._rootLogger = this.sublogger(name);
    }

    get rootDir() {
        return this._rootDir;
    }

    get logger() {
        return this._rootLogger;
    }

    get options() : Options {
        return this._rootOptions;
    }

    sublogger(name: string) : ILogger
    {
        if (name in this._subloggers) {
            return this._subloggers[name];
        }

        var logger = this._create(name);

        this._subloggers[name] = logger;

        return logger;
    }

    _setupOutputDir()
    {
        if (!this._rootOptions.enableFile) {
            return;
        }

        var dir = 'logs';
        if (this._rootOptions.path) {
            dir = this._rootOptions.path;
        }
        if (this._rootOptions.cleanOnStart) {
            emptyDirSync(dir);
        }
        if (!fsExistsSync(dir)) {
            fsMkdirSync(dir);
        }
        this._rootDir = dir;
    }

    _create(name: string) : PinoLogger
    {
        var logger = new PinoLogger(this, name);
        logger.setup(this._rootOptions);
        logger.level = this._rootOptions.level;
        return logger;
    }

}


export { RootLogger };
