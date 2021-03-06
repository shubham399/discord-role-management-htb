'use strict'
const Discord = require('discord.js')
const assignRole = process.env.ASSIGN_ROLE
const actionLog = process.env.ACTION_LOG || 'action-log'
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
const logger = require('../log.js').logger

module.exports.run = async (bot, message, args) => {
  try {
    message.delete(2000)
    if (!message.member.hasPermission('MANAGE_ROLES') || !message.guild.owner) return message.channel.send('You dont have permission to use this command.')
    if (!message.guild.me.hasPermission(['MANAGE_ROLES'])) return message.channel.send("I don't have permission to add roles!")
    // define the reason and unmutee
    const mutee = message.mentions.members.first() || message.guild.members.get(args[0])
    if (!mutee) return message.channel.send('Please supply a user to be muted!')
    let reason = args.slice(1).join(' ')
    if (!reason) reason = 'No reason given'
    // define mute role and if the mute role doesnt exist then send a message
    let muterole = mutee.roles.find(r => r.name === 'VerifedMuted')
    if (!muterole) {
      muterole = mutee.roles.find(r => r.name === 'Muted')
      if (!muterole) {
        return message.channel.send('There is no mute role to remove!')
      }
    }
    // remove role to the mentioned user and also send the user a dm explaing where and why they were unmuted
    mutee.removeRole(muterole.id).then(() => {
      if (muterole.name === 'VerifedMuted') {
        const defaultRole = message.guild.roles.find(r => r.name === assignRole)
        mutee.addRole(defaultRole.id)
      }
      mutee.send(`Hello, you have been unmuted in ${message.guild.name} for: ${reason}`).catch(err => console.log(err))
      message.channel.send(`${mutee.user.username} was unmuted!`)
    })
    // send an embed to the modlogs channel
    const embed = new Discord.RichEmbed()
      .setColor('RED')
      .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
      .addField('Moderation:', 'unmute')
      .addField('Mutee:', mutee.user.username)
      .addField('Moderator:', message.author.username)
      .addField('Reason:', reason)
      .addField('Date:', message.createdAt.toLocaleString())
    const sChannel = message.guild.channels.find(c => c.name === actionLog)
    sChannel.send(embed)
  } catch (e) {
    logger.error(e.message)
  }
}

module.exports.config = {
  name: 'unmute',
  description: 'Unmutes a member in the discord!',
  usage: `${botTriggerCommand} unmute <username> <Reason(options)>`,
  minargs: 1,
  minPermission: 'MANAGE_ROLES'
}
