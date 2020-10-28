'use strict'
const Discord = require('discord.js')
const assignRole = process.env.ASSIGN_ROLE
const logger = require('../log.js').logger
const actionLog = process.env.ACTION_LOG || 'action-log'
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND

module.exports.run = async (bot, message, args) => {
    message.delete(2000)
    // check if the command caller has permission to use the command
    if (!message.member.hasPermission('MANAGE_ROLES') || !message.guild.owner) return message.channel.send('You dont have permission to use this command.')

    if (!message.guild.me.hasPermission(['MANAGE_ROLES'])) return message.channel.send("I don't have permission to add roles!")

    // define the reason and mutee
    const mutee = message.mentions.members.first() || message.guild.members.get(args[0])
    if (!mutee) return message.channel.send('Please supply a user to be muted!')

    let reason = args.slice(1).join(' ')
    logger.verbose('Mute Reason' + reason)
    if (!reason) reason = 'No reason given'
    let muteRoleName = 'Muted'
    const muteVRole = mutee.roles.find(r => r.name === assignRole)
    if (muteVRole) {
        muteRoleName = 'VerifedMuted'
    }
    // define mute role and if the mute role doesnt exist then create one
    let muterole = message.guild.roles.find(r => r.name === muteRoleName)
    if (!muterole) {
        try {
            muterole = await message.guild.createRole({
                name: muteRoleName,
                color: '#514f48',
                permissions: []
            })
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(muterole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    SEND_TTS_MESSAGES: false,
                    ATTACH_FILES: false,
                    SPEAK: false
                })
            })
        } catch (e) {
            logger.error(e.message)
            message.channel.send(e.message).then(m => m.delete(5000))
        }
    }

    // add role to the mentioned user and also send the user a dm explaing where and why they were muted
    mutee.addRole(muterole.id).then(() => {
        if (muteRoleName === 'VerifedMuted') {
            mutee.removeRole(muteVRole.id)
        }
        mutee.send(`Hello, you have been muted in ${message.guild.name} for: ${reason}`).catch(err => console.log(err))
        message.channel.send(`${mutee.user.username} was successfully muted.`)
    })

    // send an embed to the modlogs channel
    const embed = new Discord.RichEmbed()
        .setColor('RED')
        .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
        .addField('Moderation:', 'mute')
        .addField('Mutee:', mutee.user.username)
        .addField('Moderator:', message.author.username)
        .addField('Reason:', reason)
        .addField('Date:', message.createdAt.toLocaleString())

    const sChannel = message.guild.channels.find(c => c.name === actionLog)
    sChannel.send(embed).catch((err) => {
        console.log(err)
    })
}

module.exports.config = {
    name: 'mute',
    description: 'Mutes a member in the discord!',
    usage: `${botTriggerCommand} mute <username> <Reason(options)>`,
    minargs: 1,
    minPermission: 'MANAGE_ROLES'
}
