import 'mocha';
import should = require('should');
import { Promise } from 'the-promise';
import { setupLogger, ILogger, LoggerOptions } from '../src';
import { LogLevel } from '../src/levels';

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

    it('file-output', () => {
        var options = new LoggerOptions()
            .enableFile(true)
            .path('logs/non-pretty')
            ;
        var logger = setupLogger('mylogger', options);
        output(logger);
        return Promise.timeout(100);
    });

    it('file-output-pretty', () => {
        var options = new LoggerOptions()
            .enableFile(true)
            .path('logs/pretty')
            ;
        var logger = setupLogger('mylogger', options);
        output(logger);
        return Promise.timeout(100);
    });

    it('level-silly', () => {
        var options = new LoggerOptions()
            .pretty(true)
            .level(LogLevel.silly)
            ;
        var logger = setupLogger('mylogger', options);
        output(logger);
        return Promise.timeout(100);
    });

    it('level-error', () => {
        var options = new LoggerOptions()
            .pretty(true)
            .level(LogLevel.error)
            ;
        var logger = setupLogger('mylogger', options);
        output(logger);
        return Promise.timeout(100);
    });

    it('pretty-level-debug', () => {
        var options = new LoggerOptions()
            .pretty(true)
            .level(LogLevel.debug)
            ;
        var logger = setupLogger('mylogger', options);
        output(logger);
        return Promise.timeout(100);
    });

    it('non-pretty-level-debug', () => {
        var options = new LoggerOptions()
            .level(LogLevel.debug)
            ;
        var logger = setupLogger('mylogger', options);
        output(logger);
        return Promise.timeout(100);
    });

    it('file-output-debug', () => {
        var options = new LoggerOptions()
            .enableFile(true)
            .path('logs/debug')
            .level(LogLevel.debug)
            ;
        var logger = setupLogger('mylogger', options);
        output(logger);
        return Promise.timeout(100);
    });

    it('file-output-pretty-debug', () => {
        var options = new LoggerOptions()
            .pretty(true)
            .enableFile(true)
            .path('logs/pretty-debug')
            .level(LogLevel.debug)
            ;
        var logger = setupLogger('mylogger', options);
        output(logger);
        return Promise.timeout(100);
    });


    it('file-output-try-clear-1', () => {
        var options = new LoggerOptions()
            .enableFile(true)
            .path('logs/clear-test')
            .level(LogLevel.debug)
            ;
        var logger = setupLogger('mylogger', options);
        logger.info("SHOULD NOT BE HERE");
        return Promise.timeout(100);
    });

    it('file-output-try-clear-2', () => {
        var options = new LoggerOptions()
            .enableFile(true)
            .cleanOnStart(true)
            .path('logs/clear-test')
            .level(LogLevel.debug)
            ;
        var logger = setupLogger('mylogger', options);
        output(logger);
        logger.info("SHOULD see a line: \"HELLO!!!\" below");
        return Promise.timeout(100);
    });

    it('file-output-try-clear-2', () => {
        var options = new LoggerOptions()
            .enableFile(true)
            .path('logs/clear-test')
            .level(LogLevel.debug)
            ;
        var logger = setupLogger('mylogger', options);
        logger.info("HELLO!!!");
        return Promise.timeout(100);
    });

    function output(logger: ILogger)
    {
        logger.error("E - Hello, world");
        logger.warn("W - Hello, world");
        logger.info("I - Hello, world");
        logger.debug("D - Hello, world");
        logger.verbose("V - Hello, world");
        logger.silly("S - Hello, world");
    }
});
