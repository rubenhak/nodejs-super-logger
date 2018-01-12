var log = require('./index').setup('bunyan', 'my-project',
    {
        enableFile: true,
        path: 'my-logs',
        cleanOnStart: true
    });

log.info('Hello from the app');


log = require('./index');
log.level = 'verbose';

log.info('Another hello');

log.error('Something went wrong. reason: %s', 'Object is null', {userId: 11, email: 'john@doe.com'});
log.warn('Objects are not same. ',{userId: 11, email: 'john@doe.com'}, {userId: 22, email: 'jane@doe.com'});

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

log.info('THE END.');
