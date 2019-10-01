const axios = require("axios");
const R = require('ramda');
const Discord = require("discord.js");
const constant = require("../constant.js");
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const profilePostChannel = process.env.PROFILE_CHANNEL;
const assignRole = process.env.ASSIGN_ROLE;
const logger = require("../log.js").logger
const sendActionLog = require('../helper/actionLog.js').sendActionLog
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND

module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("MANAGE_ROLES") || !message.guild.owner)
    return message.channel.send("You dont have permission to use this command.");
  let count = parseInt(args[0]) || 1
  if (count > 99) return message.channel.send("You can only delete 99 messages at a time.").then(m => m.delete(2000));
  return message.channel.bulkDelete(count + 1)
    .then(messages => {
      let embed = new Discord.RichEmbed()
        .setColor("#006ce5")
        .setTitle("Channel Purged")
        .setDescription(`${message.author} purged  ${messages.size} messages from ${message.channel.name}`)
      sendActionLog(bot, embed)
      logger.info(`Bulk deleted ${messages.size} messages`);
    })

    .catch(logger.error);
}


module.exports.config = {
  name: "purge",
  description: "Purge a channel with number of messages",
  usage: `${botTriggerCommand} purge <count>`,
  minargs: 1,
  minPermission: "MANAGE_ROLES"
}
