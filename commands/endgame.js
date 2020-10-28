'use strict'
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND

module.exports.run = async (bot, message, args) => {
  message.delete(2000)
  if (!message.member.hasPermission(['BAN_MEMBERS'])) return message.channel.send('You do not have permission to perform this command!').then(m => m.delete())
  const guild = message.guild
  const endgame = args[0].toLowerCase()
  const category = guild.channels.find(c => c.name.toLowerCase().includes('endgame') && c.type === 'category')
  const discussion = await guild.createChannel(`${endgame}`, 'text')
  await discussion.setParent(category.id)
  await discussion.lockPermissions()
}

module.exports.config = {
  name: 'endgame',
  description: 'Create a endgame discussion channel.',
  usage: `${botTriggerCommand} endgame <endgame>`,
  minargs: 1,
  minPermission: 'BAN_MEMBERS'
}
