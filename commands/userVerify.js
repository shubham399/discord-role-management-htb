'use strict'
const logger = require('../log.js').logger
const axios = require('axios')
const R = require('ramda')
const constant = require('../constant.js')

const Discord = require('discord.js')
const sendActionLog = require('../helper/actionLog.js').sendActionLog
const profilePostChannel = process.env.PROFILE_CHANNEL
const assignRole = process.env.ASSIGN_ROLE
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
const guildId = process.env.GUILD_ID

const getUserData = (token) => {
  logger.verbose(token)
  logger.verbose(constant.htburl + token)
  return axios.get(constant.htburl + token)
}

const giveRole = async function (bot, member, author, channel, hasDefaultRole, defaultRole, result, rank, htbprofile) {
  const deadRole = member.roles.find(r => r.name === 'DeadAccount')
  if (deadRole) {
    await (member.removeRole(deadRole.id))
  }
  const htbrole = member.guild.roles.find(role => role.name.toLowerCase().includes(rank.toLowerCase().replace(/\s/gi, '')))
  logger.info(author.username + ' htb rank is ' + rank + ' and giving it role ' + defaultRole.name)
  if (htbrole) {
    const hasHTBRole = member.roles.find(role => htbrole.name === role.name)
    if (hasHTBRole) {
      await (member.removeRoles([htbrole]))
    }
  }
  if (hasDefaultRole) {
    await (member.removeRoles([defaultRole]))
  }
  try {
    const embed = new Discord.RichEmbed()
      .setColor('#00E500')
      .setTitle('Member Verified:')
      .setDescription(`${member} has verified with ${rank} htb rank.`)
    sendActionLog(bot, embed)
    await (member.addRoles([defaultRole, htbrole]))
    if (!hasDefaultRole) {
      if (profilePostChannel) { // Send only if the env is set
        htbprofile.send(constant.profile(author, result.user_id)).catch(err => console.error(err))
      }
      channel.send(constant.success(author))
    } else {
      logger.verbose(author.username + ' already have the role.')
      await (channel.send(constant.alreadyVerified(author)))
    }
  } catch (e) {
    logger.error('Error:' + e)
    channel.send(constant.unableToaddRole(author))
  }
}

const getHTBRankDetails = async function (channel, author, token) {
  try {
    const response = await (getUserData(token))
    logger.verbose(response.data)
    return response.data
  } catch (error) {
    logger.error('Axios Error:' + error)
    if (R.path(['response', 'status'], error) === 404) {
      channel.send(constant.invalidToken(author))
    } else {
      channel.send(constant.htbFailure(author))
    }
  }
}

const verifyUser = async function (bot, msg, token) {
  try {
    const author = msg.author
    const member = msg.member
    const channel = msg.channel
    const result = await (getHTBRankDetails(channel, author, token))
    if (result != null) {
      const rank = result.rank
      const htbprofile = msg.guild.channels.find(channel => channel.name === profilePostChannel)
      const defaultRole = member.guild.roles.find(r => r.name === assignRole)
      const hasRole = member.roles.find(role => role.name === defaultRole.name)
      logger.verbose('API Respone: ' + JSON.stringify(result))
      logger.verbose('HasRole: ' + (hasRole != null ? hasRole.name : null))
      logger.verbose(rank)
      giveRole(bot, member, author, channel, hasRole, defaultRole, result, rank, htbprofile)
    }
  } catch (error) {
    logger.error('adding verify:' + error)
    msg.author.send(constant.dmFailure('#bot-spam'))
  }
}

const newVerifyUser = async function (bot, msg, guild, token) {
  try {
    const author = msg.author
    const member = await guild.fetchMember(msg.author)
    const channel = msg.channel
    const result = await (getHTBRankDetails(channel, author, token))
    if (result != null) {
      const rank = result.rank
      const htbprofile = guild.channels.find(channel => channel.name === profilePostChannel)
      const defaultRole = guild.roles.find(r => r.name === assignRole)
      const hasRole = member.roles.find(role => role.name === defaultRole.name)
      logger.verbose('API Respone: ' + JSON.stringify(result))
      logger.verbose('HasRole: ' + (hasRole != null ? hasRole.name : null))
      logger.verbose(rank)
      await (giveRole(bot, member, author, channel, hasRole, defaultRole, result, rank, htbprofile))
    }
  } catch (err) {
    logger.error('New Verify Error:' + err)
  }
}

module.exports.run = async (bot, message, args) => {
  logger.verbose('Reaching here')
  const token = args.filter(arg => arg.length > 20)
  logger.verbose('Token: ' + token)
  if (token.length === 0) {
    message.channel.send(constant.invalidToken(message.author))
  }
  if (message.channel.type === 'dm') {
    newVerifyUser(bot, message, bot.guilds.array().find(x => x.id === guildId), token[0])
  } else {
    message.delete(2000)
    verifyUser(bot, message, token[0])
  }
}

module.exports.config = {
  name: 'verify',
  description: 'Verify a User',
  usage: `${botTriggerCommand} verify <htb token>`,
  minargs: 1,
  minPermission: 'SEND_MESSAGES'
}
