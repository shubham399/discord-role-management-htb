'use strict'
const Discord = require('discord.js')
const constant = require('../constant.js')
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
const key = process.env.YOUTUBE_KEY;
const axios = require("axios");
const redis = require('../services/redis.js');


module.exports.run = async (bot, message, args) => {
    console.log("Reaching here");
    message.delete(2000);
    if (args.length != 1) {
        message.channel.send("Please Provide a box name to search")
    } else {
        let boxname = args[0].toLowerCase();
        const cachedResponse  = await redis.get('IPPSEC_' + boxname);
        if (cachedResponse)
        {
            message.channel.send(cachedResponse)
        }
        let response = await axios.get(constant.youtubeapi(boxname, key))
        let body = response.data;
        let videoId = body.items[0].id.videoId;
        if (videoId) {
            let videoLink = `https://www.youtube.com/watch?v=${videoId}`
            await (redis.setex('IPPSEC_' + boxname, videoLink, 24 * 3600))
            message.channel.send(videoLink);
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
