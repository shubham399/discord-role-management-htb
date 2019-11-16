'use strict'
const logger = require('../log.js').logger

function exitHandler(client,options) {
  // const nclient = new Discord.Client();
  // nclient.login(token);
  try {
    logger.info('Cleaning and Exiting')
    if (process.env.NODE_ENV === 'uat') {
      client.user.setActivity(`${botTriggerCommand} is unavailable`, {
        type: 'Playing'
      })
      client.user.setStatus('offline').then(res => {
        logger.info('Status Changed', res)
        process.exit()
      }).catch(err => {
        logger.error('Cleanup Error', err)
      })
    } else {
      process.exit()
    }
  } catch (e) {
    logger.error(e)
    process.exit()
  }
}

module.exports = (client) => {
  process.stdin.resume();
  ['SIGTERM', 'SIGINT', 'uncaughtException'].map(signal => {
    process.on(signal, exitHandler)
  })
}
