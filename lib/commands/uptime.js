'use strict'
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND

module.exports.run = async (bot, message, args) => {
  message.delete(2000)
  const uptime = bot.uptime
  const epoch = (new Date()).getTime()
  const d = new Date(0) // The 0 there is the key, which sets the date to the epoch
  d.setMilliseconds(epoch - uptime)
  message.channel.send(`${botTriggerCommand} is up since ` + d.toUTCString())
}

module.exports.config = {
  name: 'uptime',
  description: 'Get Uptime of the bot',
  usage: `${botTriggerCommand} uptime`,
  minargs: 0,
  minPermission: 'SEND_MESSAGES'
}
