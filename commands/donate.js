'use strict'
const Discord = require('discord.js')
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
const donationLink = process.env.DONATION_LINK
const logger = require('../log.js').logger

module.exports.run = async (bot, message, args) => {
    message.delete(2000)
    try {
        message.channel.send(getMessage())
    } catch (e) {
        logger.error(e.message)
    }
}

const getMessage = function() {
    const message = new Discord.RichEmbed()
        .setColor('#1a85f0')
        .setTitle('Donate')
        .setDescription(`If you love my work you can support me via ${donationLink}`)
    return message
}
module.exports.config = {
    name: 'donate',
    description: 'Send Donate Message',
    usage: `${botTriggerCommand} donate`,
    minargs: 0,
    minPermission: 'SEND_MESSAGES'
}
