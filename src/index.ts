
import { RootLogger } from './root';

import { ILogger } from './ilogger';
import { Options } from './options';

function setup(name: string, options? : Options) : ILogger {
    var rootLogger = new RootLogger(name, options);
    var logger = rootLogger.logger;
    return logger;
}

export { setup };
