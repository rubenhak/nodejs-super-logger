
import { existsSync as fsExistsSync } from 'fs';
import { emptyDirSync } from 'fs-extra/lib/empty';
import * as mkdirp from 'mkdirp'

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
            console.log("DELETING DIRECTORY")
            emptyDirSync(dir);
        }
        console.log(dir);
        if (!fsExistsSync(dir)) {
            mkdirp.sync(dir);
        }
        this._rootDir = dir;
    }

    _create(name: string) : PinoLogger
    {
        var logger = new PinoLogger(this, name);
        logger.setup(this._rootOptions);
        return logger;
    }

}


export { RootLogger };
