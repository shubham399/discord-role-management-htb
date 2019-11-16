'use strict'

const fs = require('fs')

const swearjar   = require('swearjar')
const R          = require('ramda')
const Discord    = require('discord.js')
const Sentry     = require('@sentry/node')

const token             = process.env.DISCORD_TOKEN
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
const SENTRY_DSN        = process.env.SENTRY_DSN
const alexID            = process.env.ALEX_ID

const logger           = require('./log.js').logger
const constant         = require('./config/constant.js')
const sendHelp         = require('./commands/help').sendHelp
const sendActionLog    = require('./helper/actionLog.js').sendActionLog
const handleMessage    = require('./handlers/message.js')
const exitHandler    = require('./handlers/exit.js')

const client = new Discord.Client()
Sentry.init({dsn: SENTRY_DSN})

function init(client) {
  client.commands = new Discord.Collection()
  client.config = new Discord.Collection()
  fs.readdir('./commands/', (err, files) => {
    if (err) logger.error(err)
    const jsfile = files.filter(f => f.split('.').pop() === 'js')
    if (jsfile.length <= 0) {
      return logger.warn("[LOGS] Couldn't Find Commands!")
    }
    jsfile.forEach((f, i) => {
      const pull = require(`./commands/${f}`)
      client.commands.set(pull.config.name, pull)
      client.config.set(pull.config.name, pull.config)
    })
  })
}
// Start and login the bot
client.on('guildMemberAdd', member => {
  logger.info(member.displayName + ' joined the server.')
  const embed = new Discord.RichEmbed()
    .setColor('#5780cd')
    .setTitle('Member Joined.')
    .setDescription(`${member} joined the server`)
  sendActionLog(client, embed)
  member.send('Welcome to the server!')
  sendHelp(member, client.channels.find(channel => channel.name === 'bot-spam'))
})

client.on('guildMemberRemove', member => {
  logger.info(member.displayName + ' left the server.')
  const embed = new Discord.RichEmbed()
    .setColor('#F14517')
    .setTitle('Member Left.')
    .setDescription(`${member} left the server.`)
  sendActionLog(client, embed)
})

client.login(token);

client.on('ready', () => {
  logger.info(constant.botReady(botTriggerCommand))
  if (process.env.NODE_ENV === 'production') {
    client.user.setStatus('online')
    client.user.setActivity(`${botTriggerCommand} usage`, {
      type: 'Playing'
    })
  }
})

init(client);
handleMessage(client);
exitHandler(client);
