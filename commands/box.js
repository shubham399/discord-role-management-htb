'use strict'
const logger = require('../log.js').logger
const Discord = require('discord.js')
const actionLog = process.env.ACTION_LOG || 'action-log'
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND

module.exports.run = async (bot, message, args) => {
  message.delete(2000)
  let guild = message.guild;
  let boxname = args[0].toLowerCase();
  let category = guild.channels.find(c => c.name.toLowerCase().includes("boxes") && c.type == "category");
  let hints = await guild.createChannel(`${boxname}-hints`,"text");
  hints.setParent(category.id)
  hints.lockPermissions();
  let discussion = await guild.createChannel(`${boxname}-discussion`,"text");
  discussion.setParent(category.id)
  discussion.lockPermissions();
}

module.exports.config = {
  name: 'box',
  description: 'Create a box discussion and hint channel.',
  usage: `${botTriggerCommand} box <boxname>`,
  minargs: 1,
  minPermission: 'BAN_MEMBERS'
}
