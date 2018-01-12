const SuperLogger = require('./index');

var log = SuperLogger.bunyan('kukareku', true);
log.level('silly');
log.silly('kukareku, %s = %s', 'mimi' , 11, {pipi: { iii: 333}});
log.silly('kukareku, %s = %s', 'mimi' , 11, {pipi: { iii: 333}}, {yyy: { zzz: 22}});
