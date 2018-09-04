const logger = require('../').setup('berlioz', {
    enableFile: true,
    cleanOnStart: false,
    pretty: false
});
logger.level = 'error';

logger.info("HELLO - 1");

logger.error("KUKU  %s = %s", "abc", 1234);

var data = { kuku: 11, kaka: "zzz"}
logger.info("DATA ", data);

logger.warn("DATA2 %s", data);
logger.verbose("DATA3 %s", data);
logger.silly("DATA4 ", data);


var sublogger = logger.sublogger("PROCESSOR")
sublogger.info("FROM INSIDE %s = %s", "aaa", 1234, data)

logger.level = 'info';
logger.info("DATA AFTER LEVEL CHANGE ", data);
sublogger.level = 'info';
sublogger.info("FROM INSIDE AFTER LEVEL CHANGE %s = %s", "aaa", 1234, data)
