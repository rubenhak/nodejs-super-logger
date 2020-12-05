
import { RootLogger } from './root';

import { ILogger } from './ilogger';
import { Options, OptionsBuilder } from './options';
import { DumpWriter } from './dump-writer'; 

function setupRootLogger(name: string, options? : OptionsBuilder) : RootLogger {
    let optionsObj : Options | undefined;
    if (options) {
        optionsObj = options!.build();
    }
    var rootLogger = new RootLogger(name, optionsObj);
    return rootLogger;
}

function setupLogger(name: string, options? : OptionsBuilder) : ILogger {
    const rootLogger = setupRootLogger(name, options);
    return rootLogger.logger;
}

export { setupRootLogger, setupLogger };
export { ILogger };
export { DumpWriter };
export { RootLogger };
export { OptionsBuilder as LoggerOptions };
export { LogLevel } from './levels';
