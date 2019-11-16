'use strict'
const log = require('../log')
const Discord = require('discord.js')
const actionLog = process.env.ACTION_LOG || 'action-log'
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND

module.exports.run = async (bot, message, args) => {
  message.delete(2000)
  if (!message.member.hasPermission(['BAN_MEMBERS'])) return message.channel.send('You do not have permission to perform this command!')
  const banMember = message.mentions.members.first() || message.guild.members.get(args[0])
  if (!banMember) return message.channel.send('Please provide a user to ban!')
  let reason = args.slice(1).join(' ')
  if (!reason) reason = 'No reason given!'
  log.verbose('Ban Reason' + reason)
  if (banMember.id === message.author.id) return message.channel.send('You can\'t ban yourself').then(m => m.delete(5000)) // Check if the user mention or the entered userID is the message author himsmelf
  if (!message.guild.member(banMember).bannable) return message.reply(`You can't ban this user. because ${botTriggerCommand} doesnot have sufficient permissions!`).then(m => m.delete(5000)) // Check if the user is bannable with the bot's permissions
  if (!message.guild.me.hasPermission(['BAN_MEMBERS'])) return message.channel.send('I dont have permission to perform this command').then(m => m.delete(5000))
  const embed = new Discord.RichEmbed()
    .setColor('#bc0000')
    .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
    .addField('Moderation:', 'ban')
    .addField('Moderator:', message.author.username)
    .addField('User: ', banMember.displayName)
    .addField('Reason:', reason)
    .addField('Date:', message.createdAt.toLocaleString())
  const sChannel = message.guild.channels.find(c => c.name === actionLog)
  banMember.send(`Hello, you have been banned from ${message.guild.name} for: ${reason}`).then(() =>
    message.guild.ban(banMember, {
      days: 1,
      reason: reason
    })).then(msg => {
    message.channel.send(`**${banMember.user.tag}** has been banned`).then(m => m.delete(5000))
    sChannel.send(embed)
  }).catch(err => {
    log.error(err)
    message.channel.send(`Unable to ban **${banMember.user.tag}**`).then(m => m.delete(5000))
  })
}

module.exports.config = {
  name: 'ban',
  description: 'Bans a user from the guild!',
  usage: `${botTriggerCommand} ban <username> <Reason(options)>`,
  minargs: 1,
  minPermission: 'BAN_MEMBERS'
}
