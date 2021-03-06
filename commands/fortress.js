'use strict'
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
const logger = require('../log.js').logger

module.exports.run = async (bot, message, args) => {
  try {
    message.delete(2000)
    if (!message.member.hasPermission(['BAN_MEMBERS'])) return message.channel.send('You do not have permission to perform this command!').then(m => m.delete())
    const guild = message.guild
    const fortress = args[0].toLowerCase()
    const category = guild.channels.find(c => c.name.toLowerCase().includes('fortress') && c.type === 'category')
    const discussion = await guild.createChannel(`${fortress}`, 'text')
    await discussion.setParent(category.id)
    await discussion.lockPermissions()
  } catch (e) {
    logger.error(e.message)
    message.channel.send(e.message).then(m => m.delete(5000))
  }
}

module.exports.config = {
  name: 'fortress',
  description: 'Create a fortress discussion channel.',
  usage: `${botTriggerCommand} fortress <fortress>`,
  minargs: 1,
  minPermission: 'BAN_MEMBERS'
}
