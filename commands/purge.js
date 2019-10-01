const axios = require("axios");
const R = require('ramda');
const Discord = require("discord.js");
const constant = require("../constant.js");
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const profilePostChannel = process.env.PROFILE_CHANNEL;
const assignRole = process.env.ASSIGN_ROLE;
const logger = require("../log.js").logger
const actionLog = process.env.ACTION_LOG || "action-log";
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND

module.exports.run = async (bot, message, args) => {
  
}


module.exports.config = {
  name: "purge",
  description: "Purge a channel with number of messages",
  usage: `${botTriggerCommand} purge <count>`,
  minargs: 1
}
