'use strict'
const xkcd = require('xkcd-api')
const Discord = require('discord.js')
const log = require('../log')
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
const COLORS = require('../config/colors')

module.exports.run = async (bot, message, args) => {
  message.delete(2000)
  const msg = await message.channel.send('Generating...')
  const method = args[0]
  if (method === 'random') {
    xkcd.random(function (error, response) {
      if (error) {
        log.error('xkcd Error' + error)
        message.channel.send('I broke! Try again.')
      } else {
        sendxkcd(bot, message, msg, response)
      }
    })
  } else {
    xkcd.latest(function (error, response) {
      if (error) {
        log.error('xkcd Error' + error)
        message.channel.send('I broke! Try again.')
      } else {
        sendxkcd(bot, message, msg, response)
      }
    })
  }
}

function sendxkcd (bot, message, msg, body) {
  const mEmbed = new Discord.RichEmbed()
    .setColor(COLORS.VIVID_BLUE)
    .setImage(body.img)
    .setTimestamp()
  message.channel.send({
    embed: mEmbed
  })
  msg.delete()
}

module.exports.config = {
  name: 'xkcd',
  description: 'Send the latest xkcd comic!',
  usage: `${botTriggerCommand} xkcd <random(optional)>`,
  minargs: 0,
  minPermission: 'SEND_MESSAGES'
}
