'use strict'
const logger = require('../log.js').logger
const Discord = require('discord.js')
const url = require('url');
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
let Parser = require('rss-parser');
let parser = new Parser();
const links = process.env.WRITEUP_LINKS.split(',');

module.exports.run = async (bot, message, args) => {
    message.delete(2000)
    const boxname = args[0]
    for (const link of links) {

        try {
            let list = await getFilteredRSS(link, boxname);
            if (list.length > 0)
                message.channel.send(list.map(l => l.link));
            else
                message.channel.send("Didn't find anything..");

        } catch (e) {
            logger.error("Error" + e);
            message.channel.send('I broke! Try again')
        }
    }
}

async function getFilteredRSS(link, boxname) {
    let feed = await parser.parseURL(link);
    let items = feed.items;
    return items.filter(item => {
            let title = item.title.toLowerCase();
            boxname = boxname.toLowerCase()
            return title.includes(boxname)
        })
        .map(item => {
            let got = url.parse(item.link);
            let gh = got.hostname;
            let original = url.parse(link);
            let oh = original.hostname;
            item.link = item.link.replace(gh, oh);
            return item;
        });
}

module.exports.config = {
    name: 'writeup',
    description: 'Send Writeup links from the RSS feeds.',
    usage: `${botTriggerCommand} writeup <boxname> `,
    minargs: 1,
    minPermission: 'SEND_MESSAGES'
}
