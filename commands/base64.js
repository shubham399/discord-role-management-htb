'use strict'
const logger = require('../log.js').logger

const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND

module.exports.run = async (bot, message, args) => {
  try {
    logger.verbose('Reaching here')
    message.delete(2000)
    if (!message.member.hasPermission(['SEND_MESSAGES'])) return message.channel.send('You do not have permission to perform this command!').then(m => m.delete())
    logger.info('Args:' + JSON.stringify(args))
    if (args[0].toLowerCase() === 'encode' || args[0].toLowerCase() === 'e') {
      message.channel.send(message.author.toString() + ' here is the base64 string: of `' + args[1] + '` : `' + (Buffer.from(args[1]).toString('base64')) + '`')
    } else if (args[0].toLowerCase() === 'decode' || args[0].toLowerCase() === 'd') {
      try {
        message.channel.send(message.author.toString() + ' here is the base64 decoded string: `' + args[1] + '` `' + (Buffer.from(args[1], 'base64').toString('ascii')) + '`')
      } catch (e) {
        logger.error(e.message)
        message.channel.send(message.author.toString() + ' please pass a valid base64 encoded string.')
      }
    } else {
      message.channel.send('Invalid command try `badgers base64 encode String` or`badgers base64 decode String`')
    }
  } catch (e) {
    logger.error(e.message)
  }
}

module.exports.config = {
  name: 'base64',
  description: 'Encode/Decode base64',
  usage: `${botTriggerCommand} verify encode/decode <message>`,
  minargs: 2,
  minPermission: 'SEND_MESSAGES'
}
