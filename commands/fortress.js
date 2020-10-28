'use strict'
const logger = require('../log.js').logger
const Discord = require('discord.js')
const actionLog = process.env.ACTION_LOG || 'action-log'
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND

module.exports.run = async (bot, message, args) => {
  message.delete(2000)
  const guild = message.guild
  const fortress = args[0].toLowerCase()
  const category = guild.channels.find(c => c.name.toLowerCase().includes('fortress') && c.type == 'category')
  await hints.setParent(category.id)
  await hints.lockPermissions()
  const discussion = await guild.createChannel(`${fortress}`, 'text')
  await discussion.setParent(category.id)
  await discussion.lockPermissions()
}

module.exports.config = {
  name: 'fortress',
  description: 'Create a fortress discussion channel.',
  usage: `${botTriggerCommand} fortress <fortress>`,
  minargs: 1,
  minPermission: 'BAN_MEMBERS'
}
