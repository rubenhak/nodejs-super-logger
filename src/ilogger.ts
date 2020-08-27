type ILoggerFunc = (msg: string, ...args: any[]) => void;

interface ILogger
{
    sublogger(name: string) : ILogger,

    exception: (error: Error) => void,
    
    error: ILoggerFunc,
    warn: ILoggerFunc,
    info: ILoggerFunc,
    verbose: ILoggerFunc,
    debug: ILoggerFunc,
    silly: ILoggerFunc,
}

export { ILogger, ILoggerFunc }