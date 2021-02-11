
import { emptyDirSync } from 'fs-extra/lib/empty';

import { ILogger } from './ilogger';
import { Options } from './options';
import { PinoLogger } from './loggers/pino';

import { ensureDirectory } from './file-utils';
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

    close()
    {
        for (let key in this._subloggers) {
            let logger = this._subloggers[key];
            logger.close();
        }
        this._subloggers = {};
    }

    sublogger(name: string) : ILogger
    {
        if (name in this._subloggers) {
            return this._subloggers[name];
        }

        let logger = this._create(name);

        this._subloggers[name] = logger;

        return logger;
    }

    private _setupOutputDir()
    {
        if (!this._rootOptions.enableFile) {
            return;
        }

        let dir = 'logs';
        if (this._rootOptions.path) {
            dir = this._rootOptions.path;
        }
        if (this._rootOptions.cleanOnStart) {
            emptyDirSync(dir);
        }

        ensureDirectory(dir);
        
        this._rootDir = dir;
    }

    private _create(name: string) : PinoLogger
    {
        let logger = new PinoLogger(this, name);
        logger.setup(this._rootOptions);
        logger.info('Initialized');
        return logger;
    }

}


export { RootLogger };
