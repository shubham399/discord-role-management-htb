const winston = require('winston');
const level = process.env.LOG_LEVEL || "debug";
const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  if (typeof message)
  message = JSON.stringify(message);
  return `${timestamp} [${label}] ${level}: ${message}`;
});
module.exports.logger = winston.createLogger({
  level: level,
  format: combine(
    label({ label: 'Bot! ' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        label({ label: 'Bot! ' }),
        timestamp(),
        myFormat
      )
    })
  ]
});
