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
const sendHelp = require("./help").sendHelp

module.exports.run = async (bot, message, args) => {
  message.delete(2000);
  if (!message.member.hasPermission(["BAN_MEMBERS"])) return message.channel.send("You do not have permission to perform this command!")
  try {
    let unVerifedMembers = message.guild.members.filter(member => !member.user.bot).filter((member, result) => {
      let defaultRole = member.guild.roles.find(r => r.name === assignRole);
      let hasRole = member.roles.find(role => role.name == defaultRole.name);
      return !hasRole
    }).map(async (member => {
      try {
        logger.verbose("Reminding: " + member.displayName);
        await (member.send("This is a gentle reminder to verify yourself on this server."));
        await (member.send("You can follow these steps to verify yourself."));
        await (sendHelp(member, message.guild.channels.find(channel => channel.name === "bot-spam")))
      } catch (error) {
        logger.warn(member + " : " + error)
      }
    }))
  } catch (error) {
    logger.error(error)
  }
}

module.exports.config = {
  name: "remind",
  description: "Remind users to Verify!",
  usage: `${botTriggerCommand} remind`
}
