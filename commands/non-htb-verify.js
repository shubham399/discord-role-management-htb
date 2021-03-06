'use strict'
const logger = require('../log.js').logger
const constant = require('../constant.js')
const assignRole = process.env.ASSIGN_ROLE
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
const guildId = process.env.GUILD_ID
const nonHTBRole = process.env.NON_HTB_ROLE || 'Non-HTB Verified'

const giveRole = async function (member, author, channel, hasRole, defaultRole) {
  if (!hasRole) {
    const memberRole = member.roles.find(r => r.name === 'Member')
    if (memberRole) {
      await (member.removeRole(memberRole.id))
    }
    const deadRole = member.roles.find(r => r.name === 'DeadAccount')
    if (deadRole) {
      await (member.removeRole(deadRole.id))
    }
    member.addRoles([defaultRole]).then(r => {
      channel.send(constant.success(author))
    }).catch((e) => {
      logger.error('Error:' + e)
      channel.send(constant.unableToaddRole(author))
    })
  } else {
    logger.verbose(author.username + ' already have the role.')
    await (channel.send(constant.alreadyVerified(author)))
  }
}

const newVerifyUser = async function (msg, guild) {
  try {
    const author = msg.author
    const member = await guild.fetchMember(msg.author)
    const channel = msg.channel
    let nonHTBRoleObj = guild.roles.find(r => r.name === nonHTBRole)
    if (!nonHTBRoleObj) {
      try {
        nonHTBRoleObj = await (guild.createRole({
          name: nonHTBRole,
          color: '#514f48',
          permissions: []
        }))
        guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(nonHTBRoleObj, {
            SEND_MESSAGES: true,
            ADD_REACTIONS: true,
            SEND_TTS_MESSAGES: true,
            ATTACH_FILES: true,
            SPEAK: true
          })
        })
      } catch (e) {
        console.log(e.stack)
      }
    }
    const hasRole = member.roles.find(role => role.name === nonHTBRole)
    const htbVerified = member.roles.find(role => role.name === assignRole)
    logger.verbose('HasRole: ' + (hasRole != null ? hasRole.name : null))
    logger.verbose('htbVerified: ' + (htbVerified != null ? htbVerified.name : null))
    if (!htbVerified) {
      giveRole(member, author, channel, hasRole, nonHTBRoleObj)
    } else {
      await (channel.send(constant.notUpdatedNonHTB(author)))
    }
  } catch (err) {
    logger.error('New Verify Error:' + err.message)
  }
}

module.exports.run = async (bot, message, args) => {
  try{
  logger.verbose('Executing non-htb')
  if (message.channel.type === 'dm') {
    newVerifyUser(message, bot.guilds.array().find(x => x.id === guildId))
  } else {
    message.delete(2000)
    message.channel.send('Please verify from bot dm').then(m => m.delete(2000)).catch(e => logger.error(e))
    // verifyUser(message, token[0])
  }
}
catch(e){
    logger.error("Error: ",e.message);
}
}

module.exports.config = {
  name: 'non-htb',
  description: 'Verify a non-htb member User',
  usage: `${botTriggerCommand} non-htb`,
  minargs: 0,
  minPermission: 'SEND_MESSAGES'
}
