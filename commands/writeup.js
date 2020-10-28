'use strict'
const logger = require('../log.js').logger
const url = require('url')
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
const Parser = require('rss-parser')
const parser = new Parser()
const links = process.env.WRITEUP_LINKS.split(',')

module.exports.run = async (bot, message, args) => {
  message.delete(2000)
  const boxname = args[0]
  let response = []
  for (const link of links) {
    try {
      const list = await getFilteredRSS(link, boxname)
      response = response.concat(list)
    } catch (e) {
      logger.error('Error' + e)
    }
  }
  if (response.length > 0) { message.channel.send(response.map(l => l.link)) } else { message.channel.send("Didn't find anything..") }
}

async function getFilteredRSS (link, boxname) {
  const feed = await parser.parseURL(link)
  const items = feed.items
  return items.filter(item => {
    const title = item.title.toLowerCase()
    boxname = boxname.toLowerCase()
    return title.includes(boxname)
  })
    .map(item => {
      const got = url.parse(item.link)
      const gh = got.hostname
      const original = url.parse(link)
      const oh = original.hostname
      item.link = item.link.replace(gh, oh)
      return item
    })
}

module.exports.config = {
  name: 'writeup',
  description: 'Send Writeup links from the RSS feeds.',
  usage: `${botTriggerCommand} writeup <boxname> `,
  minargs: 1,
  minPermission: 'SEND_MESSAGES'
}
