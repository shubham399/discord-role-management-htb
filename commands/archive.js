'use strict'
const logger = require('../log.js').logger
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND

module.exports.run = async (bot, message, args) => {
  message.delete(2000)
  if (!message.member.hasPermission(['BAN_MEMBERS'])) return message.channel.send('You do not have permission to perform this command!').then(m => m.delete())
  try {
    const guild = message.guild
    const channel = message.channel
    const category = guild.channels.find(c => c.name.toLowerCase().includes('archive') && c.type === 'category')
    await channel.setParent(category.id)
    await channel.lockPermissions()
  } catch (e) {
    logger.error(e.message)
    message.channel.send(`Unable to archive channel`).then(m => m.delete(5000))
  }
}

module.exports.config = {
  name: 'archive',
  description: 'Archive a channel from the guild!',
  usage: `${botTriggerCommand} archive`,
  minargs: 0,
  minPermission: 'BAN_MEMBERS'
}
