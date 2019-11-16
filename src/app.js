'use strict'

const fs = require('fs')
const Discord = require('discord.js')
const Sentry = require('@sentry/node')

const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
const SENTRY_DSN = process.env.SENTRY_DSN

const Lib = require('../lib')
const Log = Lib.log
const constant = Lib.constants
const Handlers = Lib.Handlers
const commandsDir = Lib.COMMAND_DIR

Sentry.init({
  dsn: SENTRY_DSN
})

// Initialize and add all the commands to the client
const init = client => {
  client.commands = new Discord.Collection()
  client.config = new Discord.Collection()
  fs.readdir(commandsDir, (err, files) => {
    if (err) Log.error(err)
    const jsfile = files.filter(f => f.split('.').pop() === 'js')
    if (jsfile.length <= 0) {
      return Log.warn("[LOGS] Couldn't Find Commands!")
    }
    jsfile.forEach((f, i) => {
      const pull = require(commandsDir + f)
      client.commands.set(pull.config.name, pull)
      client.config.set(pull.config.name, pull.config)
    })
  })
}

const app = (client, token) => {
  client.on('ready', () => {
    Log.info(constant.botReady(botTriggerCommand))
    if (process.env.NODE_ENV === 'production') {
      client.user.setStatus('online')
      client.user.setActivity(`${botTriggerCommand} usage`, {
        type: 'Playing'
      })
    }
  })
  client.login(token)
  init(client)
  Handlers.messageHandler(client, constant)
  Handlers.guildMemberHandler(client)
  Handlers.exitHandler(client)
}
module.exports = app
