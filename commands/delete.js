'use strict'
const logger = require('../log.js').logger
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND

module.exports.run = async (bot, message, args) => {
  message.delete(2000)
  if (!message.member.hasPermission(['ADMINISTRATOR'])) return message.channel.send('You do not have permission to perform this command!').then(m => m.delete())
  try {
    const guild = message.guild
    const channel = message.channel
    await channel.delete(); 
  } catch (e) {
    logger.error(e.message)
    message.channel.send('Unable to delete channel').then(m => m.delete(5000))
  }
}

module.exports.config = {
  name: 'delete',
  description: 'Delete a channel from the guild!',
  usage: `${botTriggerCommand} delete`,
  minargs: 0,
  minPermission: 'ADMINISTRATOR'
}
