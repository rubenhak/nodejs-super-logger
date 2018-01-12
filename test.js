var log = require('./index').setup('bunyan', 'my-project', true);


log = require('./index');

log.level('verbose');

log.info('Hello from the app');
log.error('Something went wrong. reason: %s', 'Object is null', {userId: 11, email: 'john@doe.com'});
log.warn('Objects are not same. ',{userId: 11, email: 'john@doe.com'}, {userId: 22, email: 'jane@doe.com'});

try {
    throw new Error('Index is out of range');
} catch (e) {
    log.exception(e);
    log.error(e);
    log.error('There was en exception', e);
} finally {
    log.verbose('Processing completed. Elapsed time: %s sec.', 15);
}
