'use strict'
const logger = require('../log.js').logger
const Discord = require('discord.js')
const actionLog = process.env.ACTION_LOG || 'action-log'
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND

module.exports.run = async (bot, message, args) => {
  message.delete(2000)
  try {
    const guild = message.guild
    const channel = message.channel
    const category = guild.channels.find(c => c.name.toLowerCase().includes('archive') && c.type == 'category')
    await channel.setParent(category.id)
    await channel.lockPermissions()
  } catch (e) {
    logger.error(e.message)
  }
}

module.exports.config = {
  name: 'archive',
  description: 'Archive a channel from the guild!',
  usage: `${botTriggerCommand} archive`,
  minargs: 0,
  minPermission: 'BAN_MEMBERS'
}
