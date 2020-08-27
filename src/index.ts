
import { RootLogger } from './root';

import { ILogger } from './ilogger';
import { Options, OptionsBuilder } from './options';

function setup(name: string, options? : OptionsBuilder) : ILogger {
    let optionsObj : Options | undefined;
    if (options) {
        optionsObj = options!.build();
    }
    var rootLogger = new RootLogger(name, optionsObj);
    var logger = rootLogger.logger;
    return logger;
}

export { setup as setupLogger };
export { ILogger };
export { OptionsBuilder as LoggerOptions };
