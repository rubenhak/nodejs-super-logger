import { createWriteStream } from 'fs';
import { Writable } from 'stream';
import _ from 'the-lodash';
import { MyPromise } from 'the-promise';

class DumpWriter {
    private _writer: Writable;
    private _indent = 0;

    constructor(filePath: string) {
        this._writer = createWriteStream(filePath);
    }

    write(obj: any): DumpWriter {
        if (_.isNullOrUndefined(obj)) {
            return this;
        }

        if (_.isString(obj) || _.isNumber(obj) || _.isBoolean(obj)) {
            this._writer.write('    '.repeat(this._indent));
            this._writer.write(obj);
            this._writer.write('\n');
        } else {
            for (const x of JSON.stringify(obj, null, 4).split('\n')) {
                this._writer.write('    '.repeat(this._indent));
                this._writer.write(x);
                this._writer.write('\n');
            }
        }
        return this;
    }

    writeHeader(str: string): DumpWriter {
        this._writer.write('\n');
        this._writer.write('**** ' + str + '\n');
        return this;
    }

    newLine(): DumpWriter {
        this._writer.write('\n');
        return this;
    }

    indent(): DumpWriter {
        this._indent++;
        return this;
    }

    unindent(): DumpWriter {
        this._indent--;
        return this;
    }

    close(): Promise<void> {
        return MyPromise.construct((resolve, reject) => {
            this._writer.on('error', (err) => {
                reject(err);
            });
            this._writer.end(null, 'utf8', () => {
                resolve();
            });
        });
    }
}

export { DumpWriter };
