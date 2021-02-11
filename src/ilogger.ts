type ILoggerFunc = (msg: string, ...args: any[]) => void;
import { DumpWriter } from './dump-writer';

interface ILogger {
    sublogger(name: string): ILogger;

    exception: (error: Error) => void;

    error: ILoggerFunc;
    warn: ILoggerFunc;
    info: ILoggerFunc;
    verbose: ILoggerFunc;
    debug: ILoggerFunc;
    silly: ILoggerFunc;

    outputStream(fileName: string): DumpWriter | null;
    outputFile(fileName: string, contents: any): Promise<void>;
}

export { ILogger, ILoggerFunc };
