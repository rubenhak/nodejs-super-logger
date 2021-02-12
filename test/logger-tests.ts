import 'mocha';
import should = require('should');
import { Promise } from 'the-promise';
import { setupLogger, setupRootLogger, ILogger, LoggerOptions } from '../src';
import { LogLevel } from '../src/levels';

describe('logger-tests', () => {
    it('default-use', () => {
        const rootLogger = setupRootLogger('mylogger');
        const logger = rootLogger.logger;
        output(logger);
        return Promise.timeout(100).then(() => {
            rootLogger.close();
        });
    });

    it('pretty', () => {
        var options = new LoggerOptions().pretty(true);
        const logger = setupLogger('mylogger', options);
        output(logger);
        return Promise.timeout(100);
    });

    it('file-output', () => {
        var options = new LoggerOptions().enableFile(true).path('logs/non-pretty');
        const rootLogger = setupRootLogger('mylogger', options);
        const logger = rootLogger.logger;
        output(logger);
        return Promise.timeout(100);
    });

    it('file-output-pretty', () => {
        var options = new LoggerOptions().enableFile(true).path('logs/pretty');
        const rootLogger = setupRootLogger('mylogger', options);
        const logger = rootLogger.logger;
        output(logger);
        return Promise.timeout(100);
    });

    it('level-silly', () => {
        var options = new LoggerOptions().pretty(true).level(LogLevel.silly);
        const rootLogger = setupRootLogger('mylogger', options);
        const logger = rootLogger.logger;
        output(logger);
        return Promise.timeout(100);
    });

    it('level-error', () => {
        var options = new LoggerOptions().pretty(true).level(LogLevel.error);
        const rootLogger = setupRootLogger('mylogger', options);
        const logger = rootLogger.logger;
        output(logger);
        return Promise.timeout(100);
    });

    it('pretty-level-debug', () => {
        var options = new LoggerOptions().pretty(true).level(LogLevel.debug);
        const rootLogger = setupRootLogger('mylogger', options);
        const logger = rootLogger.logger;
        output(logger);
        return Promise.timeout(100);
    });

    it('non-pretty-level-debug', () => {
        var options = new LoggerOptions().level(LogLevel.debug);
        const rootLogger = setupRootLogger('mylogger', options);
        const logger = rootLogger.logger;
        output(logger);
        return Promise.timeout(100);
    });

    it('file-output-debug', () => {
        var options = new LoggerOptions().enableFile(true).path('logs/debug').level(LogLevel.debug);
        const rootLogger = setupRootLogger('mylogger', options);
        const logger = rootLogger.logger;
        output(logger);
        return Promise.timeout(100);
    });

    it('file-output-pretty-debug', () => {
        var options = new LoggerOptions().pretty(true).enableFile(true).path('logs/pretty-debug').level(LogLevel.debug);
        const rootLogger = setupRootLogger('mylogger', options);
        const logger = rootLogger.logger;
        output(logger);
        return Promise.timeout(100);
    });

    it('file-output-try-clear-1', () => {
        var options = new LoggerOptions().enableFile(true).path('logs/clear-test').level(LogLevel.debug);
        const rootLogger = setupRootLogger('mylogger', options);
        const logger = rootLogger.logger;
        logger.info('SHOULD NOT BE HERE');
        return Promise.timeout(100);
    });

    it('file-output-try-clear-2', () => {
        var options = new LoggerOptions()
            .enableFile(true)
            .cleanOnStart(true)
            .path('logs/clear-test')
            .level(LogLevel.debug);
        const rootLogger = setupRootLogger('mylogger', options);
        const logger = rootLogger.logger;
        output(logger);
        logger.info('SHOULD see a line: "HELLO!!!" below');
        return Promise.timeout(100);
    });

    it('file-output-try-clear-2', () => {
        var options = new LoggerOptions().enableFile(true).path('logs/clear-test').level(LogLevel.debug);
        const rootLogger = setupRootLogger('mylogger', options);
        const logger = rootLogger.logger;
        logger.info('HELLO!!!');
        return Promise.timeout(100);
    });

    it('sublogger', () => {
        var options = new LoggerOptions().level(LogLevel.debug).subLevel('processor', LogLevel.error);
        const rootLogger = setupRootLogger('mylogger', options);
        const logger = rootLogger.logger;
        const sub = logger.sublogger('processor');
        output(sub);
        return Promise.timeout(100).then(() => {
            rootLogger.close();
        });
    });

    function output(logger: ILogger) {
        logger.error('E - Hello, world');
        logger.warn('W - Hello, world');
        logger.info('I - Hello, world');
        logger.debug('D - Hello, world');
        logger.verbose('V - Hello, world');
        logger.silly('S - Hello, world');

        logger.info('Test: %s + %s = %s', 4, 5, 4 + 5);

        var obj = {
            foo: 'bar',
            another: {
                foo: 'not-foo',
            },
        };
        logger.info('Hello : ', obj);

        logger.info('Hello  %s!, data: ', 'world', obj);

        try {
            throw new Error('We did something wrong');
        } catch (reason) {
            logger.exception(reason);
            logger.error('Error happened. no argument: ', reason);
            logger.error('Error happened. with argument: %s', reason);
            logger.warn('Error happened. custom format, no error argument. in %s: ', '[output]', reason);
            logger.warn('Error happened. custom format, with error argument. in %s: . err: %s', '[output]', reason);
        }
    }
});
