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
const sendHelp = require("./help").sendHelp;
const ignoreList = process.env.REMIND_IGNORE_LIST;
const guildId = process.env.GUILD_ID;
const redis = require("../services/redis.js")

module.exports.run = async (bot, message, args) => {
  redis.get("REMIND", function(err, inCooldown) {
    if (inCooldown) return message.channel.send("This command is in cooldown.")
    await (redis.setex("REMIND", "REMIND", 604800))
    message.delete(2000);
    if (!message.member.hasPermission(["ADMINISTRATOR"])) return message.channel.send("You do not have permission to perform this command!")
    try {
      let ignoreListArray = ignoreList.trim().split(",")
      let guild = await (bot.guilds.array().find(x => x.id === guildId).fetchMembers())
      let unVerifedMembers = guild.members.filter(member => !member.user.bot).filter(member => !ignoreListArray.includes(member.user.username)).filter((member, result) => {
        let defaultRole = member.guild.roles.find(r => r.name === assignRole);
        let hasRole = member.roles.find(role => role.name == defaultRole.name);
        return !hasRole
      })
      logger.info("Sending Reminders to: " + unVerifedMembers.size + " members")
      unVerifedMembers.map(async (member => {
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
  })
}

module.exports.config = {
  name: "remind",
  description: "Remind users to Verify!",
  usage: `${botTriggerCommand} remind`
}
