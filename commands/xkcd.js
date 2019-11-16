'use strict'
const logger = require('../log').logger
const Discord = require('discord.js')
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
const xkcd = require('xkcd-api')

module.exports.run = async (bot, message, args) => {
  message.delete(2000)
  const msg = await message.channel.send('Generating...')
  const method = args[0]
  if (method === 'random') {
    xkcd.random(function (error, response) {
      if (error) {
        logger.error('xkcd Error' + error)
        message.channel.send('I broke! Try again.')
      } else {
        sendxkcd(bot, message, msg, response)
      }
    })
  } else {
    xkcd.latest(function (error, response) {
      if (error) {
        logger.error('xkcd Error' + error)
        message.channel.send('I broke! Try again.')
      } else {
        sendxkcd(bot, message, msg, response)
      }
    })
  }
}

function sendxkcd (bot, message, msg, body) {
  const mEmbed = new Discord.RichEmbed()
    .setColor('#1a85f0')
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
