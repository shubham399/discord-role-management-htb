'use strict'
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND

module.exports.run = async (bot, message, args) => {
  message.delete(2000)
  if (!message.member.hasPermission(['BAN_MEMBERS'])) return message.channel.send('You do not have permission to perform this command!').then(m => m.delete())
  const guild = message.guild
  const challenges = args[0].toLowerCase()
  const category = guild.channels.find(c => c.name.toLowerCase().includes('challenges') && c.type === 'category')
  const discussion = await guild.createChannel(`${challenges}`, 'text')
  await discussion.setParent(category.id)
  await discussion.lockPermissions()
}

module.exports.config = {
  name: 'challenges',
  description: 'Create a challenges discussion channel.',
  usage: `${botTriggerCommand} challenges <challenges>`,
  minargs: 1,
  minPermission: 'BAN_MEMBERS'
}
