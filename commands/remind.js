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
const gracePeriod = process.env.GRACE_PERIOD || 30;
const remindPeriod = process.env.REMIND_INTERVAL || 24;
const redis = require("../services/redis.js")

module.exports.run = async (bot, message, args) => {
  message.delete(2000);
  const date = new Date();
  date.setDate(date.getDate() - gracePeriod) // get 30 days old date.
  if (!message.member.hasPermission(["ADMINISTRATOR"])) return message.channel.send("You do not have permission to perform this command!").then(m => m.delete())
  let remindMember = message.mentions.members.first() || message.guild.members.get(args[0]);
  if (!remindMember) {
    try {
      let ignoreListArray = ignoreList.trim().split(",")
      logger.verbose(ignoreListArray);
      let guild = await (bot.guilds.array().find(x => x.id === guildId).fetchMembers())
      logger.verbose(guild);
      let unVerifedMembers = guild.members.filter(member => !member.user.bot)
        .filter(function(member) {
          return member.joinedAt < date
        })
        .filter(member => !ignoreListArray.includes(member.user.username)).filter((member, result) => {
          let hasRole = member.roles.map(role => role.name)
          return (hasRole.length === 1)
        });
      logger.verbose(unVerifedMembers);
      remindMembers(message, unVerifedMembers, false);
    } catch (error) {
      logger.error("unVerifed: " + error)
    }
  } else {
    try {
      remindMembers(message, [remindMember], true);
    } catch (error) {
      logger.error("remindMember: " + error)
    }
  }
}

function remindMembers(message, unVerifedMembers, status) {
  unVerifedMembers.map(async (member => {
    try {
      let shouldRemind = await (redis.get("REMIND_" + member.id));
      logger.verbose("Should Remind" + member.displayName + " is " + shouldRemind);
      if (!shouldRemind) {
        let redisSet = await (redis.setex("REMIND_" + member.id, "REMIND", remindPeriod * 3600))
        logger.info("Sending Reminder to : " + member.displayName);
        await (member.send("This is a gentle reminder to verify yourself on this server."));
        await (member.send("You can follow these steps to verify yourself."));
        await (sendHelp(member, message.guild.channels.find(channel => channel.name === "bot-spam")))
        await (member.send("*Note:* Please verify yourself to not get this message again."));
        if (status) {
          message.channel.send("Successfully reminded " + member.displayName).then(m => m.delete(2000)).catch(errr => {})
        }

      } else {
        logger.verbose("Skipping: " + member.displayName);
        if (status) {
          message.channel.send("Skipping reminder to " + member.displayName).then(m => m.delete(2000)).catch(errr => {})
        }
      }
    } catch (error) {
      logger.warn(member + " : " + error)
    }
  }));
}


module.exports.config = {
  name: "remind",
  description: "Remind users to Verify!",
  usage: `${botTriggerCommand} remind`,
  minargs: 0,
  minPermission: "ADMINISTRATOR"
}
