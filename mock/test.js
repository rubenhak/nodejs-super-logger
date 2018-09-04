var log = require('..').setup('my-project',
    {
        enableFile: true,
        path: 'my-logs',
        cleanOnStart: true,
        pretty: false
    });
log.level = 'warn';

log.info('Hello from the app');

log = require('..');

log.info('Another hello');

log.error('Something went wrong. reason: %s', 'Object is null', {userId: 11, email: 'john@doe.com'});
log.warn('Objects are not same. ',{userId: 11, email: 'john@doe.com'}, {userId: 22, email: 'jane@doe.com'});

var contents = {'aaa': 'bbb', 'zzz': 123};
log.outputFile('test.txt', contents);

try {
    throw new Error('Index is out of range');
} catch (e) {
    log.exception(e);
    log.error(e);
    log.error('There was en exception', e);
} finally {
    log.info('Processing completed.');
    log.verbose('Processing completed. Elapsed time: %s sec.', 15);
}

var awsLogger = log.sublogger('AWS');
awsLogger.info('Hello from AWS');

var azureLogger = log.sublogger('AZURE');
azureLogger.warn('Hello from Azure');

log.level = 'info';

log.info('THE END.');
