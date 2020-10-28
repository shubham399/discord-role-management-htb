'use strict'
const logger = require('../log.js').logger
const Discord = require('discord.js')
const actionLog = process.env.ACTION_LOG || 'action-log'
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND

module.exports.run = async (bot, message, args) => {
  message.delete(2000)
  const guild = message.guild
  const challenges = args[0].toLowerCase()
  const category = guild.channels.find(c => c.name.toLowerCase().includes('challenges') && c.type == 'category')
  await hints.setParent(category.id)
  await hints.lockPermissions()
  const discussion = await guild.createChannel(`${challenges}`, 'text')
  await discussion.setParent(category.id)
  await discussion.lockPermissions()
}

module.exports.config = {
  name: 'challenges',
  description: 'Create a challenges discussion channel.',
  usage: `${botTriggerCommand} challenges <challenges>`,
  minargs: 1,
  minPermission: 'BAN_MEMBERS'
}
