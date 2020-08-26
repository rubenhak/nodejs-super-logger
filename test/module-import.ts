import 'mocha';
import should = require('should');
import { Promise } from 'the-promise';
import { setupLogger, ILogger, LoggerOptions } from '../src';

describe('logger-tests', () => {
    
    it('default-use', () => {
        var logger = setupLogger('mylogger');
        output(logger);
        return Promise.timeout(100);
    });

    it('pretty', () => {
        var options = new LoggerOptions()
            .pretty(true);
        var logger = setupLogger('mylogger', options);
        output(logger);
        return Promise.timeout(100);
    });

    function output(logger: ILogger)
    {
        logger.info("I - Hello, world");
        logger.error("E - Hello, world");
        logger.warn("W - Hello, world");
        logger.debug("D - Hello, world");
        logger.silly("S - Hello, world");
        logger.verbose("V - Hello, world");
    }
});
