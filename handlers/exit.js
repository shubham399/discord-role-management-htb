'use strict'
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND

const log = require('../log')

const handle = client => options => {
  try {
    log.info('Cleaning and Exiting')
    if (process.env.NODE_ENV === 'production') {
      client.user.setActivity(`${botTriggerCommand} is unavailable`, {
        type: 'Playing'
      })
      client.user.setStatus('offline').then(res => {
        log.info('Status Changed', res)
        process.exit()
      }).catch(err => {
        log.error('Cleanup Error', err)
      })
    } else {
      process.exit()
    }
  } catch (e) {
    log.error(e)
    process.exit()
  }
}

module.exports = client => {
  process.stdin.resume()
  const exitHandle = handle(client);
  ['SIGTERM', 'SIGINT', 'uncaughtException'].map(signal => {
    process.on(signal, exitHandle)
  })
}