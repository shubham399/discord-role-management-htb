const swearjar = require('swearjar')
const R = require('ramda');

const alexID = process.env.ALEX_ID
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND

const logger = require('../log').logger;

const handleMessage = (client) => {
  client.on('message', (message) => {
    logger.verbose(message.content)
    const isAlex = R.path(['member', 'id'], message) === alexID
    if (swearjar.profane(message.content) && isAlex) {
      message.channel.send(`${message.member} Language`).then(m => m.delete(3000))
      message.channel.send(message.member + ' said ' + swearjar.censor(message.content))
      message.delete()
    }
    const messageArray = message.content.split(' ').filter(x => x !== '')
    if (messageArray.length === 0) return
    const trigger = messageArray[0].toLowerCase()
    if (trigger !== botTriggerCommand) return
    logger.verbose(messageArray)
    const cmd = messageArray.length > 1 ? messageArray[1].toLowerCase() : null
    logger.info(message.author.username + ' is executing ' + cmd)
    if ((message.author.bot || message.channel.type === 'dm') && !(cmd === 'verify' || cmd === 'non-htb')) return
    const args = messageArray.slice(2)
    if (cmd === null) {
      message.channel.send(constant.default(botTriggerCommand)).then(m => m.delete(2000))
      return
    }
    const commandFile = client.commands.get(cmd)
    if (commandFile) {
      const config = client.config.get(cmd)
      if (args.length < config.minargs) {
        message.delete(2000)
        message.channel.send('Usage: ```' + config.usage + '```').then(m => m.delete(2000))
      } else {
        commandFile.run(client, message, args)
      }
    } else {
      message.channel.send('Invalid command.').then(m => m.delete(2000))
    }
  })
}

module.exports = handleMessage;
