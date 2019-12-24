'use strict'
const Discord = require('discord.js')
const constant = require('../constant.js')
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
const key = process.env.YOUTUBE_KEY;
const axios = require("axios");



module.exports.run = async (bot, message, args) => {
    console.log("Reaching here");
    message.delete(2000);
    if (args.length != 1) {
        message.channel.send("Please Provide a box name to search")
    } else {
        let response = await axios.get(constant.youtubeapi(args[0], key))
        let body = response.data;
        let videoId = body.items[0].id.videoId;
        if (videoId) {
            message.channel.send(`https://www.youtube.com/watch?v=${videoId}`)
        } else {
            message.channel.send("Please specify a valid box name.")
        }
    }
}

module.exports.config = {
    name: 'ippsec',
    description: 'Get ippsec video url.!',
    usage: `${botTriggerCommand} ippsec <box>`,
    minargs: 1,
    minPermission: 'SEND_MESSAGES'
}
