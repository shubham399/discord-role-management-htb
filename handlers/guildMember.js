const Discord = require('discord.js')
const log = require('../log')
const sendActionLog = require('../helper/actionLog').sendActionLog
const sendHelp = require('../commands/help').sendHelp
const COLORS = require('../config/colors')

module.exports = client => {
  // Start and login the bot
  client.on('guildMemberAdd', member => {
    log.info(member.displayName + ' joined the server.')
    const embed = new Discord.RichEmbed()
      .setColor(COLORS.LIGHT_BLUE)
      .setTitle('Member Joined.')
      .setDescription(`${member} joined the server`)
    sendActionLog(client, embed)
    member.send('Welcome to the server!')
    sendHelp(member, client.channels.find(channel => channel.name === 'bot-spam'))
  })

  client.on('guildMemberRemove', member => {
    log.info(member.displayName + ' left the server.')
    const embed = new Discord.RichEmbed()
      .setColor(COLORS.RED)
      .setTitle('Member Left.')
      .setDescription(`${member} left the server.`)
    sendActionLog(client, embed)
  })
}