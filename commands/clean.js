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
const gracePeriod = process.env.DEAD_ACCOUNT_GRACE_PERIOD || 90;
const remindPeriod = process.env.REMIND_INTERVAL || 24;
const redis = require("../services/redis.js")

module.exports.run = async (bot, message, args) => {
  message.delete(2000);
  const date = new Date();
  date.setDate(date.getDate() - gracePeriod) // get 30 days old date.
  let deadRole = message.guild.roles.find(r => r.name === "DeadAccount")
  if (!deadRole) {
    try {
      deadRole = await message.guild.createRole({
        name: "DeadAccount",
        color: "#514f48",
        permissions: []
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(deadRole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
          SEND_TTS_MESSAGES: false,
          ATTACH_FILES: false,
          SPEAK: false
        })
      })
    } catch (e) {
      console.log(e.stack);
    }
  }
  if (!message.member.hasPermission(["ADMINISTRATOR"])) return message.channel.send("You do not have permission to perform this command!").then(m => m.delete())
  try {
    let ignoreListArray = ignoreList.trim().split(",")
    let guild = await (bot.guilds.array().find(x => x.id === guildId).fetchMembers())
    let unVerifedMembers = guild.members.filter(member => !member.user.bot)
      .filter(function(member) {
        return member.joinedAt < date
      })
      .filter(member => !ignoreListArray.includes(member.user.username)).filter((member, result) => {
        let hasRole = member.roles.map(role => role.name)
        return (hasRole.length === 1)
      })
    logger.info("Cleaning account: " + unVerifedMembers.size + " members")
    for(member of unVerifedMembers)
    {
      try {
        await(member.addRole(deadRole.id))
      } catch (error) {
        logger.warn(member + " : " + error)
      }
    }

    // unVerifedMembers.map(async (member => {
    //
    // }))
  } catch (error) {
    logger.error(error)
  }
}

module.exports.config = {
  name: "clean",
  description: "Add DeadAaccount role for account not verifed in 60 days.",
  usage: `${botTriggerCommand} clean`,
  minargs: 0
}
