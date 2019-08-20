const logger = require("../log.js").logger
const axios = require("axios");
const R = require('ramda');
const Discord = require("discord.js");
const constant = require("../constant.js");
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const profilePostChannel = process.env.PROFILE_CHANNEL;
const assignRole = process.env.ASSIGN_ROLE;
const actionLog = process.env.ACTION_LOG || "action-log";
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND;

module.exports.run = async (bot, message, args) => {
  message.delete(2000);
  let configs = bot.config.array();
  // console.log(config)
  let embed = new Discord.RichEmbed()
    .setTitle(`Usage for ${botTriggerCommand} `)
    .setColor("#1a85f0")
  for (config of configs) {
    embed.addField(config.name, config.usage)
  }
  message.channel.send(embed)
}

module.exports.config = {
  name: "usage",
  description: "Get Usage for the bot",
  usage: `${botTriggerCommand} usage`,
  minargs: 0
}
