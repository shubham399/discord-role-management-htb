'use strict'
const log = require('../log')
const Discord = require('discord.js')
const assignRole = process.env.ASSIGN_ROLE
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
const reportChannel = process.env.REPORT_CHANNEL
const nonHTBRole = process.env.NON_HTB_ROLE || 'Non-HTB Verified'
const COLORS = require('../config/colors')
module.exports.run = async (bot, message, args) => {
  message.delete(2000)
  const defaultRole = message.member.guild.roles.find(r => r.name === assignRole)
  const hasRole = message.member.roles.find(role => role.name === defaultRole.name || role.name === nonHTBRole)
  if (!hasRole) return message.channel.send("You don't have permission to Report other users.").then(m => m.delete(5000))
  const reportMember = message.mentions.members.first() || message.guild.members.get(args[0])
  if (message.author.username === reportMember.displayName) return message.channel.send('You cannot report yourself.').then(m => m.delete(5000))
  const reason = args.slice(1).join(' ')
  if (!reason) return message.channel.send('You must provide a reason for report.').then(m => m.delete(5000))
  log.verbose('Report Reason' + reason)
  message.channel.send(`**${reportMember.user.tag}** has been Reported`).then(m => m.delete(5000))
  const embed = new Discord.RichEmbed()
    .setColor(COLORS.DARK_RED)
    .setAuthor(`${message.guild.name}`, message.guild.iconURL)
    .addField('Reported By:', message.author.username)
    .addField('User: ', reportMember.displayName)
    .addField('Reason:', reason)
    .addField('Date:', message.createdAt.toLocaleString())
  const sChannel = message.guild.channels.find(c => c.name === reportChannel)
  sChannel.send(embed)
}

module.exports.config = {
  name: 'report',
  description: 'Report a user to guild staffs.',
  usage: `${botTriggerCommand} report <username> <Reason>`,
  minargs: 2,
  minPermission: 'SEND_MESSAGES'
}
