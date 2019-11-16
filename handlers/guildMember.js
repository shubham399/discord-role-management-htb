
const logger           = require('../log').logger
const sendActionLog    = require('../helper/actionLog').sendActionLog

module.exports = function (client){
  // Start and login the bot
  client.on('guildMemberAdd', member => {
    logger.info(member.displayName + ' joined the server.')
    const embed = new Discord.RichEmbed()
      .setColor('#5780cd')
      .setTitle('Member Joined.')
      .setDescription(`${member} joined the server`)
    sendActionLog(client, embed)
    member.send('Welcome to the server!')
    sendHelp(member, client.channels.find(channel => channel.name === 'bot-spam'))
  })

  client.on('guildMemberRemove', member => {
    logger.info(member.displayName + ' left the server.')
    const embed = new Discord.RichEmbed()
      .setColor('#F14517')
      .setTitle('Member Left.')
      .setDescription(`${member} left the server.`)
    sendActionLog(client, embed)
  })
}
