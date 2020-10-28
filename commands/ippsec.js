'use strict'
const constant = require('../constant.js')
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
const key = process.env.YOUTUBE_KEY
const axios = require('axios')
const redis = require('../services/redis.js')
const logger = require('../log.js').logger
const R = require('ramda')

const getBoxVideoLink = async (boxname) => {
    const response = await axios.get(constant.youtubeapi(boxname, key))
    const body = response.data
    const videoId = R.path(['items', '0', 'id', 'videoId'], body) // body.items[0].id.videoId;
    const title = R.path(['items', '0', 'snippet', 'title'], body)
    logger.verbose('Video Id from Response ' + videoId)
    if (videoId && title.toLowerCase().includes(boxname)) {
        const videoLink = `https://www.youtube.com/watch?v=${videoId}`
        await (redis.setex('IPPSEC_' + boxname, videoLink, 24 * 3600)) // cache it
        logger.info('Sending URL from API call ' + videoLink)
        return videoLink
    } else {
        return null
    }
}

module.exports.run = async (bot, message, args) => {
    message.delete(2000)
    try {
        if (args.length !== 1) {
            message.channel.send('Please Provide a box name to search')
        } else {
            const boxname = args[0].toLowerCase().trim()
            const cachedResponse = await redis.get('IPPSEC_' + boxname)
            if (cachedResponse) {
                logger.info('Sending URL from cache' + cachedResponse)
                message.channel.send(cachedResponse)
            } else {
                const videoLink = await getBoxVideoLink(boxname)
                if (videoLink) {
                    message.channel.send(videoLink)
                } else {
                    message.channel.send('Please specify a valid box name.')
                }
            }
        }
    } catch (e) {
        logger.error(e.message)
        message.channel.send("Unable to find Video Link! Please Try again").then(m => m.delete(5000))
    }
}

module.exports.config = {
    name: 'ippsec',
    description: 'Get ippsec video url.!',
    usage: `${botTriggerCommand} ippsec <box>`,
    minargs: 1,
    minPermission: 'SEND_MESSAGES'
}
