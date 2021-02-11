import _ from 'the-lodash';
import { join as pathJoin } from 'path';

import { Options } from './options';
import { LogLevel } from './levels';
import { RootLogger } from './root';
import { ILogger } from './ilogger';

import { DumpWriter } from './dump-writer';
import { ensureFileDirectory } from './file-utils';

class BaseLogger {
    private _root: RootLogger;
    private _name: string;
    protected _logFile: string | null = null;
    private _level: LogLevel = LogLevel.info;
    private _options: Options;

    constructor(root: RootLogger, name: string) {
        this._root = root;
        this._name = name;
        this._options = root.options;
    }

    get name(): string {
        return this._name;
    }

    get level(): LogLevel {
        return this._level;
    }

    get options(): Options {
        return this._options;
    }

    setup(options: Options) {
        this._options = options;

        if (this._options.enableFile) {
            let dir = this._root.rootDir!;
            this._logFile = pathJoin(dir, this._name + '.log');
        } else {
            this._logFile = null;
        }

        this._level = this.options.level;
        this._implInit();
    }

    sublogger(name: string): ILogger {
        return this._root.sublogger(name);
    }

    _implInit(): void {
        throw new Error('Not Implemented');
    }

    flush(): void {}

    outputStream(fileName: string): DumpWriter | null {
        if (!this.options.enableFile) {
            return null;
        }

        const filePath = pathJoin(this._root.rootDir!, fileName);
        ensureFileDirectory(filePath);
        const writer = new DumpWriter(filePath);
        return writer;
    }

    outputFile(fileName: string, contents: any): Promise<void> {
        const writer = this.outputStream(fileName);
        if (!writer) {
            return Promise.resolve();
        }
        return writer!.write(contents).close();
    }
}

export { BaseLogger };
