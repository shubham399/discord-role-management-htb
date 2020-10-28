'use strict'
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
const logger = require('../log.js').logger

module.exports.run = async (bot, message, args) => {
    message.delete(2000)
    try {
        if (!message.member.hasPermission(['BAN_MEMBERS'])) return message.channel.send('You do not have permission to perform this command!').then(m => m.delete())
        const guild = message.guild
        const boxname = args[0].toLowerCase()
        const category = guild.channels.find(c => c.name.toLowerCase().includes('boxes') && c.type === 'category')
        const hints = await guild.createChannel(`${boxname}-hints`, 'text')
        await hints.setParent(category.id)
        await hints.lockPermissions()
        const discussion = await guild.createChannel(`${boxname}-discussion`, 'text')
        await discussion.setParent(category.id)
        await discussion.lockPermissions()
    } catch (e) {
        logger.error(e.message)
        message.channel.send(e.message).then(m => m.delete(5000))
    }
}

module.exports.config = {
    name: 'box',
    description: 'Create a box discussion and hint channel.',
    usage: `${botTriggerCommand} box <boxname>`,
    minargs: 1,
    minPermission: 'BAN_MEMBERS'
}
