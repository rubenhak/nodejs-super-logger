import 'mocha';
import should = require('should');
import { setup as setupLogger } from '../src';

describe('logger-tests', () => {
    
    it('default-use', () => {
        var logger = setupLogger('mylogger');
        logger.info("I - Hello, world");
        logger.error("E - Hello, world");
        logger.warn("W - Hello, world");
        logger.debug("D - Hello, world");
        logger.silly("S - Hello, world");
        logger.verbose("V - Hello, world");
    });

});
