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
  let uptime = bot.uptime;
  let epoch = (new Date).getTime();
  let d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setMilliseconds(epoch - uptime);
  message.channel.send(`${botTriggerCommand} is up since `+d.toUTCString()).then(m=> m.delete(10000))
}

module.exports.config = {
  name: "uptime",
  description: "Get Uptime of the bot",
  usage: `${botTriggerCommand} uptime`,
  minargs: 0
}
