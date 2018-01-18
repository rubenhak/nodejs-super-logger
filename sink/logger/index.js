var winston = require('winston');
const { format } = require('logform');
const fs = require('fs');
const del = require('delete');

const Loggly = require('winston-loggly-bulk');
// const LogglyTransport = require('winston-loggly-transport');

var LOG_LEVEL = null;
var LOG_FILE_NAME = 'berlioz.log';
var LOG_ERROR_FILE_NAME = 'berlioz_error.log';

class MyFormatter
{
    constructor(name, colorize, addTime)
    {
        this._name = name;
        this._myTransformer = format.splat();

        if (colorize)
        {
            this._myTransformer = format.combine(
                this._myTransformer,
                format.colorize())
        }

        if (addTime)
        {
            this._myTransformer = format.combine(
                this._myTransformer,
                format.timestamp())
        }

        this._myTransformer = format.combine(
            this._myTransformer,
            format.printf(info => {
                var meta = '';
                if (info.meta) {
                    meta = ' : ' + JSON.stringify(info.meta, null, 2);
                }
                var level = info.level.replace('error', 'erro');
                level = level.replace('silly', 'sily');
                level = level.replace('verbose', 'verb');
                level = level.replace('debug', 'dbug');
                if (info.category) {
                    return `${info.timestamp} | ${level} | ${info.category} | ${info.message} ` + meta;
                } else {
                    return `${info.timestamp} | ${level} | ${info.message} ` + meta;
                }
           })
        );
    }

    transform(info, options)
    {
        info.category = this._name;
        return this._myTransformer.transform(info, options);
    }
}

var loggerObject = null;

function constructLogger() {
    del.sync(['logs_berlioz']);
    fs.mkdirSync('logs_berlioz');

    loggerObject =  winston.createLogger({
        level: LOG_LEVEL,
    });
    loggerObject._mySubloggers = {};
    setupLogger(loggerObject, null);

    module.exports = loggerObject;
    return loggerObject;
}

function sublogger(name) {
    if (name in loggerObject._mySubloggers) {
        return loggerObject._mySubloggers[name];
    }

    var x = winston.loggers.add(name);
    setupLogger(x, name);

    loggerObject._mySubloggers[name] = x;
    return x;
}

function setupLogger(logger, name)
{
    logger.level = LOG_LEVEL;
    logger.sublogger = sublogger;

    logger.add(new winston.transports.Console({
        format: new MyFormatter(name, true, true)
    }));

    var fname = 'berlioz';
    if (name) {
        fname = fname + '_' + name;
    }

    logger.add(new winston.transports.File({
        filename: 'logs_berlioz/' + fname,
        format: new MyFormatter(name, false, true),
    }));

    logger.add(new winston.transports.File({
        level: 'error',
        filename: 'logs_berlioz/' + fname + '_error',
        format: new MyFormatter(name, false, true),
    }));

    // logger.add(new Loggly.Loggly({
    //     token: "42f71b24-8e7a-4268-99ec-dbb5029f076a",
    //     subdomain: "rubenhak",
    //     tags: ["BERLIOZ"],
    //     json: false
    // }));

    //
    // logger.add(new LogglyTransport({
    //     token: "42f71b24-8e7a-4268-99ec-dbb5029f076a",
    //     subdomain: "rubenhak",
    //     tags: ["Winston-NodeJS"],
    //     json: true
    // }));
    //

    expandErrors(logger);
}

function expandErrors(logger) {
  logger.exception = function(error) {
      if (error instanceof Error) {
          logger.error('Exception %s', error.message);
          for(var line of error.stack.split('\n')) {
              logger.error(line);
          }
      } else {
          logger.error('Error %s', error);
      }
  };
}

module.exports = function(level) {
    LOG_LEVEL = level;
    if (!loggerObject) {
        constructLogger();
    }
    return loggerObject;
}
//
// logger.sublogger = function(name) {
//     var x = winston.loggers.add(name, getLoggerOptions(name));
//     x.sublogger = logger.sublogger;
//     return x;
// }

//module.exports = logger;
