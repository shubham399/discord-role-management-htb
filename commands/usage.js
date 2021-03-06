'use strict'
const Discord = require('discord.js')
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
const logger = require('../log.js').logger

module.exports.run = async (bot, message, args) => {
  try {
    message.delete(2000)
    const highestRole = message.member.highestRole
    let configs = bot.config.array()
    configs = configs.filter(x => highestRole.hasPermission([x.minPermission]))
    const embed = new Discord.RichEmbed()
      .setTitle(`Usage for ${botTriggerCommand} `)
      .setColor('#1a85f0')
    for (const config of configs) {
      embed.addField(config.name, config.usage)
    }
    message.channel.send(embed)
  } catch (e) {
    logger.error(e.message)
  }
}

module.exports.config = {
  name: 'usage',
  description: 'Get Usage for the bot',
  usage: `${botTriggerCommand} usage`,
  minargs: 0,
  minPermission: 'SEND_MESSAGES'
}
