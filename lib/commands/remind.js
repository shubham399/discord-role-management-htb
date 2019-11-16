'use strict'
const log = require('../log')
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
const sendHelp = require('./help').sendHelp
const ignoreList = process.env.REMIND_IGNORE_LIST
const guildId = process.env.GUILD_ID
const gracePeriod = process.env.GRACE_PERIOD || 30
const remindPeriod = process.env.REMIND_INTERVAL || 24
const redis = require('../services/redis')

module.exports.run = async (bot, message, args) => {
  message.delete(2000)
  const date = new Date()
  date.setDate(date.getDate() - gracePeriod) // get 30 days old date.
  if (!message.member.hasPermission(['ADMINISTRATOR'])) return message.channel.send('You do not have permission to perform this command!').then(m => m.delete())
  const remindMember = message.mentions.members.first() || message.guild.members.get(args[0])
  if (!remindMember) {
    try {
      const ignoreListArray = ignoreList.trim().split(',')
      log.verbose(ignoreListArray)
      const guild = await (bot.guilds.array().find(x => x.id === guildId).fetchMembers())
      log.verbose(guild)
      const unVerifedMembers = guild.members.filter(member => !member.user.bot)
        .filter(function (member) {
          return member.joinedAt < date
        })
        .filter(member => !ignoreListArray.includes(member.user.username)).filter((member, result) => {
          const hasRole = member.roles.map(role => role.name)
          return (hasRole.length === 1)
        })
      log.verbose(unVerifedMembers)
      remindMembers(message, unVerifedMembers, false)
    } catch (error) {
      log.error('unVerifed: ' + error)
    }
  } else {
    try {
      remindMembers(message, [remindMember], true)
    } catch (error) {
      log.error('remindMember: ' + error)
    }
  }
}

function remindMembers (message, unVerifedMembers, status) {
  unVerifedMembers.map(async (member) => {
    try {
      const shouldRemind = await (redis.get('REMIND_' + member.id))
      log.verbose('Should Remind' + member.displayName + ' is ' + shouldRemind)
      if (!shouldRemind) {
        await (redis.setex('REMIND_' + member.id, 'REMIND', remindPeriod * 3600))
        log.info('Sending Reminder to : ' + member.displayName)
        await (member.send('This is a gentle reminder to verify yourself on this server.'))
        await (member.send('You can follow these steps to verify yourself.'))
        await (sendHelp(member, message.guild.channels.find(channel => channel.name === 'bot-spam')))
        await (member.send('*Note:* Please verify yourself to not get this message again.'))
        if (status) {
          message.channel.send('Successfully reminded ' + member.displayName).then(m => m.delete(2000)).catch(errr => {})
        }
      } else {
        log.verbose('Skipping: ' + member.displayName)
        if (status) {
          message.channel.send('Skipping reminder to ' + member.displayName).then(m => m.delete(2000)).catch(errr => {})
        }
      }
    } catch (error) {
      log.warn(member + ' : ' + error)
    }
  })
}

module.exports.config = {
  name: 'remind',
  description: 'Remind users to Verify!',
  usage: `${botTriggerCommand} remind`,
  minargs: 0,
  minPermission: 'ADMINISTRATOR'
}
