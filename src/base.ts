import _ from 'the-lodash';
import { join as pathJoin }  from 'path';
import { createWriteStream }  from 'fs';

import { Options } from './options';
import { LogLevel } from './levels';
import { RootLogger } from './root';
import { ILogger } from './ilogger';

class BaseLogger
{
    private _root: RootLogger;
    private _name : string;
    protected _logFile : string | null = null;
    private _level: LogLevel = LogLevel.info;
    private _options : Options;
    
    constructor(root : RootLogger, name : string)
    {
        this._root = root;
        this._name = name;
        this._options = root.options;
    }

    get name() : string {
        return this._name;
    }

    get level() : LogLevel {
        return this._level;
    }

    get options() : Options {
        return this._options;
    }

    setup(options : Options)
    {
        this._options = options;

        if (this._options.enableFile) {
            var dir = this._root.rootDir!;
            this._logFile = pathJoin(dir, this._name + '.log');
        } else {
            this._logFile = null;
        }

        this._level = this.options.level;
        this._implInit();
    }

    sublogger(name: string) : ILogger
    {
        return this._root.sublogger(name);
    }

    _implInit()
    {
        throw new Error("Not Implemented");
    }

    flush()
    {

    }



    outputStream(fileName: string)
    {
        if (!this.options.enableFile) {
            return null;
        }

        var filePath = pathJoin(this._root.rootDir!, fileName);
        var writer = createWriteStream(filePath);

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
                wrapper.write();
                wrapper.write('**** ' + str);
            },
            indent: () => {
                wrapper._indent++;
            },
            unindent: () => {
                wrapper._indent--;
            },
            close: () => {
                return new Promise((resolve, reject) => {
                    writer.on('error', (err) => {
                        reject(err);
                    });
                    writer.end(null, null, () => {
                        resolve();
                    });
                    writer.end();
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
}

export { BaseLogger };
