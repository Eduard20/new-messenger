import winston from 'winston';

import config from '../config.js';
const { combine, colorize, label, printf } = winston.format;

/*
Used default logging levels, which is syslog levels:
Note: Logging function names are corresponding logging level names and
      logging levels are prioritized from 0 to 5 (highest to lowest)

    levels: {
        error:   0,
        warn:    1,
        info:    2,
        verbose: 3,
        debug:   4,
        silly:   5
    }
*/

const devFormat = combine(
  colorize(),
  label({ label: '[messenger]' }),
  printf(function ({ label, level, message }) {
    const parsedString =
      typeof message === 'string' || message instanceof String
        ? message.replace(/(\r\n|\n|\r)/gm, '')
        : JSON.stringify(message, null, 2);
    return `${colorize().colorize('silly', label)} ${level}: ${parsedString}`;
  })
);

export const loggerService = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: config.logLevel,
      format: devFormat
    })
  ]
});

loggerService.stream = {
  write(message) {
    loggerService.info(message);
  }
};

export default {
  error: function (message) {
    loggerService.error(message);
  },
  warn: function (message) {
    loggerService.warn(message);
  },
  info: function (message) {
    loggerService.info(message);
  },
  verbose: function (message) {
    loggerService.verbose(message);
  },
  debug: function (message) {
    loggerService.debug(message);
  },
  silly: function (message) {
    loggerService.silly(message);
  }
};
