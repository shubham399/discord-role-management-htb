'use strict'
const token = process.env.DISCORD_TOKEN
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
const Discord = require('discord.js')
const client = new Discord.Client()
const logger = require('./log.js').logger
const constant = require('./constant.js')
const sendHelp = require('./commands/help').sendHelp
const sendActionLog = require('./helper/actionLog.js').sendActionLog
const fs = require('fs')
const swearjar = require('swearjar')
const R = require('ramda')
const alexID = process.env.ALEX_ID
function exitHandler (options) {
  // const nclient = new Discord.Client();
  // nclient.login(token);
  try {
    logger.info('Cleaning and Exiting')
    if (process.env.NODE_ENV === 'production') {
      client.user.setActivity(`${botTriggerCommand} is unavailable`, {
        type: 'Playing'
      })
      client.user.setStatus('offline').then(res => {
        logger.info('Status Changed', res)
        process.exit()
      }).catch(err => {
        logger.error('Cleanup Error', err)
      })
    } else {
      process.exit()
    }
  } catch (e) {
    logger.error(e)
    process.exit()
  }
}
// do something when app is closing
// process.on('exit', exitHandler);
process.stdin.resume()
process.on('SIGTERM', exitHandler)
// catches ctrl+c event
process.on('SIGINT', exitHandler)

// catches uncaught exceptions
process.on('uncaughtException', exitHandler)

const Sentry = require('@sentry/node')
Sentry.init({
  dsn: process.env.SENTRY_DSN
})

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

client.on('ready', () => {
  logger.info(constant.botReady(botTriggerCommand))
  if (process.env.NODE_ENV === 'production') {
    client.user.setStatus('online')
    client.user.setActivity(`${botTriggerCommand} usage`, {
      type: 'Playing'
    })
  }
})

client.on('message', (message) => {
  logger.verbose(message.content)
  const isAlex = R.path(['member', 'id'], message) === alexID
  if (swearjar.profane(message.content) && isAlex) {
    message.channel.send(`${message.member} Language`).then(m => m.delete(3000))
    message.channel.send(message.member + ' said ' + swearjar.censor(message.content))
    message.delete()
  }
  const messageArray = message.content.split(' ').filter(x => x !== '')
  if (messageArray.length === 0) return
  const trigger = messageArray[0].toLowerCase()
  if (trigger !== botTriggerCommand) return
  logger.verbose(messageArray)
  const cmd = messageArray.length > 1 ? messageArray[1].toLowerCase() : null
  logger.info(message.author.username + ' is executing ' + cmd)
  if ((message.author.bot || message.channel.type === 'dm') && !(cmd === 'verify' || cmd === 'non-htb')) return
  const args = messageArray.slice(2)
  if (cmd === null) {
    message.channel.send(constant.default(botTriggerCommand)).then(m => m.delete(2000))
    return
  }
  const commandFile = client.commands.get(cmd)
  if (commandFile) {
    const config = client.config.get(cmd)
    if (args.length < config.minargs) {
      message.delete(2000)
      message.channel.send('Usage: ```' + config.usage + '```').then(m => m.delete(2000))
    } else {
      commandFile.run(client, message, args)
    }
  } else {
    message.channel.send('Invalid command.').then(m => m.delete(2000))
  }
})
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

client.login(token)
