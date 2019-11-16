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

const log           = require('./log')
const constant         = require('./config/constant')
const sendHelp         = require('./commands/help').sendHelp
const sendActionLog    = require('./helper/actionLog').sendActionLog
const handleMessage    = require('./handlers/message')
const guildMemberHandler    = require('./handlers/guildMember')
const exitHandler    = require('./handlers/exit')

const client = new Discord.Client()
Sentry.init({dsn: SENTRY_DSN})

// Initialize and add all the commands to the client
function init(client) {
  client.commands = new Discord.Collection()
  client.config = new Discord.Collection()
  fs.readdir('./commands/', (err, files) => {
    if (err) log.error(err)
    const jsfile = files.filter(f => f.split('.').pop() === 'js')
    if (jsfile.length <= 0) {
      return log.warn("[LOGS] Couldn't Find Commands!")
    }
    jsfile.forEach((f, i) => {
      const pull = require(`./commands/${f}`)
      client.commands.set(pull.config.name, pull)
      client.config.set(pull.config.name, pull.config)
    })
  })
}

client.login(token);

client.on('ready', () => {
  log.info(constant.botReady(botTriggerCommand))
  if (process.env.NODE_ENV === 'production') {
    client.user.setStatus('online')
    client.user.setActivity(`${botTriggerCommand} usage`, {
      type: 'Playing'
    })
  }
})

init(client);
handleMessage(client);
guildMemberHandler(client);
exitHandler(client);
