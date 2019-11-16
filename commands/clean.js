'use strict'
const logger = require('../log').logger
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
const ignoreList = process.env.REMIND_IGNORE_LIST
const guildId = process.env.GUILD_ID
const gracePeriod = process.env.DEAD_ACCOUNT_GRACE_PERIOD || 90

module.exports.run = async (bot, message, args) => {
  message.delete(2000)
  const date = new Date()
  date.setDate(date.getDate() - gracePeriod) // get 30 days old date.
  let deadRole = message.guild.roles.find(r => r.name === 'DeadAccount')
  if (!deadRole) {
    try {
      deadRole = await message.guild.createRole({
        name: 'DeadAccount',
        color: '#514f48',
        permissions: []
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(deadRole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
          SEND_TTS_MESSAGES: false,
          ATTACH_FILES: false,
          SPEAK: false
        })
      })
    } catch (e) {
      console.log(e.stack)
    }
  }
  if (!message.member.hasPermission(['ADMINISTRATOR'])) return message.channel.send('You do not have permission to perform this command!').then(m => m.delete())
  try {
    const ignoreListArray = ignoreList.trim().split(',')
    const guild = await (bot.guilds.array().find(x => x.id === guildId).fetchMembers())
    const unVerifedMembers = guild.members.filter(member => !member.user.bot)
      .filter(function (member) {
        return member.joinedAt < date
      })
      .filter(member => !ignoreListArray.includes(member.user.username)).filter((member, result) => {
        const hasRole = member.roles.map(role => role.name)
        return (hasRole.length === 1)
      })
    logger.info('Cleaning account: ' + unVerifedMembers.size + ' members')
    for (const member of unVerifedMembers) {
      try {
        await (member.addRole(deadRole.id))
      } catch (error) {
        logger.warn(member + ' : ' + error)
      }
    }

    // unVerifedMembers.map(async (member => {
    //
    // }))
  } catch (error) {
    logger.error(error)
  }
}

module.exports.config = {
  name: 'clean',
  description: 'Add DeadAaccount role for account not verifed in 60 days.',
  usage: `${botTriggerCommand} clean`,
  minargs: 0,
  minPermission: 'ADMINISTRATOR'
}
