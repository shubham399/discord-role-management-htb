'use strict'
const winston = require('winston')
const level = process.env.LOG_LEVEL || 'verbose'
const os = require('os')
const {
  combine,
  timestamp,
  label,
  printf
} = winston.format

const myFormat = printf(({
  level,
  message,
  label,
  timestamp
}) => {
  if (typeof message === 'object') { message = JSON.stringify(message) }
  return `${timestamp} ${label} ${level}: ${message}`
})
module.exports.logger = winston.createLogger({
  level: level,
  format: combine(
    label({
      label: os.hostname()
    }),
    timestamp(),
    myFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        winston.format.colorize(),
        label({
          label: os.hostname()
        }),
        timestamp(),
        myFormat
      )
    })
  ]
})
