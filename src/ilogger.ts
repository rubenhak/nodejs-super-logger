interface ILoggerFunc {
    (msg: string, ...args: any[]): void;
    (obj: object, msg?: string, ...args: any[]): void;
}


interface ILogger
{
    sublogger(name: string) : ILogger,

    error: ILoggerFunc,
    warn: ILoggerFunc,
    info: ILoggerFunc,
    verbose: ILoggerFunc,
    debug: ILoggerFunc,
    silly: ILoggerFunc,
}

export { ILogger, ILoggerFunc }