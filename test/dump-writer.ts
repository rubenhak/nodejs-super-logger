import 'mocha';
import should = require('should');
import { Promise } from 'the-promise';
import { setupLogger, setupRootLogger, ILogger, LoggerOptions } from '../src';
import { LogLevel } from '../src/levels';

describe('dump-writer', () => {
    
    it('file-output', () => {
        const options = new LoggerOptions()
            .enableFile(true)
            .path('logs/dump-writer')
            ;
        const rootLogger = setupRootLogger('mylogger', options);
        const logger = rootLogger.logger;
        const writer = logger.outputStream('sample-dump1');
        should(writer).be.ok();
        
        const data = {
            'foo': {
                'bar' : [
                    'foo1',
                    'foo2'
                ]
            }
        }

        return Promise.resolve()
            .then(() => { 
                return writer!
                    .writeHeader("H1")
                    .writeHeader("H2")
                    .write("xxx")
                    .indent()
                    .write("yyy")
                    .write(data)
                    .indent()
                    .write("zzz")
                    .newLine()
                    .unindent()
                    .write("111")
                    .writeHeader("H3")
                    .close()
            })
            .then(() => {
                return Promise.timeout(100);
            })
    });

    it('file-output', () => {
        const options = new LoggerOptions()
            .enableFile(true)
            .path('logs/dump-file')
            ;
        const logger = setupLogger('mylogger', options);

        const data = {
            'foo': {
                'bar' : [
                    'foo1',
                    'foo2'
                ]
            }
        }
        
        return Promise.resolve()
            .then(() => { 
                return logger.outputFile('sample-file1', data);
            })
            .then(() => {
                return Promise.timeout(100);
            })
    });

});
