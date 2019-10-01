const logger = require("../log.js").logger
const axios = require("axios");
const R = require('ramda');
const constant = require("../constant.js");
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const Discord = require("discord.js");
const sendActionLog = require('../helper/actionLog.js').sendActionLog
const profilePostChannel = process.env.PROFILE_CHANNEL;
const assignRole = process.env.ASSIGN_ROLE;
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND
const guildId = process.env.GUILD_ID;

const getUserData = (token) => {
  logger.verbose(token)
  logger.verbose(constant.htburl + token)
  return axios.get(constant.htburl + token)
};


const giveRole = async (function(bot, member, author, channel, hasDefaultRole, defaultRole, result, rank, htbprofile) {
  let deadRole = member.roles.find(r => r.name === "DeadAccount")
  if (deadRole) {
    await (member.removeRole(deadRole.id))
  }
  let htbrole = member.guild.roles.find(role => role.name.toLowerCase().includes(rank.toLowerCase().replace(/\s/gi, "")))
  logger.info(author.username + " htb rank is " + rank + " and giving it role " + defaultRole.name);
  if (htbrole) {
    let hasHTBRole = member.roles.find(role => htbrole.name == role.name);
    if (hasHTBRole)
      await (member.removeRoles([htbrole]))
  }
  if (hasDefaultRole)
    await (member.removeRoles([defaultRole]))
  try {
    let embed = new Discord.RichEmbed()
      .setColor("#00E500")
      .setTitle("Member Verified:")
      .setDescription(`${member} has verified with ${rank} htb rank.`)
    sendActionLog(bot, embed)
    await (member.addRoles([defaultRole, htbrole]))
    if (!hasDefaultRole) {
      htbprofile.send(constant.profile(author, result.user_id)).catch(err => console.error(err))
      channel.send(constant.success(author))
    } else {
      logger.verbose(author.username + " already have the role.");
      await (channel.send(constant.alreadyVerified(author)));
    }
  } catch (e) {
    logger.error("Error:" + e);
    channel.send(constant.unableToaddRole(author))
  }
});

const getHTBRankDetails = async (function(channel, author, token) {
  try {
    return await (getUserData(token)).data;
  } catch (error) {
    logger.error("Axios Error:" + error);
    if (R.path(["response", "status"], error) === 404) {
      channel.send(constant.invalidToken(author))
    } else {
      channel.send(constant.htbFailure(author))
    }
  }
});

const verifyUser = async (function(bot, msg, token) {
  try {
    let author = msg.author;
    let member = msg.member;
    let channel = msg.channel;
    let result = await (getHTBRankDetails(channel, author, token));
    if (result != null) {
      let rank = result.rank;
      let htbprofile = msg.guild.channels.find(channel => channel.name === profilePostChannel)
      let defaultRole = member.guild.roles.find(r => r.name === assignRole);
      let hasRole = member.roles.find(role => role.name == defaultRole.name);
      logger.verbose("API Respone: " + JSON.stringify(result));
      logger.verbose("HasRole: " + (hasRole != null ? hasRole.name : null))
      logger.verbose(rank);
      giveRole(bot, member, author, channel, hasRole, defaultRole, result, rank, htbprofile)
    }
  } catch (error) {
    logger.error("adding verify:" + error);
    msg.author.send(constant.dmFailure("#bot-spam"));
  }
});


const newVerifyUser = async (function(bot, msg, guild, token) {
  try {
    let author = msg.author;
    await (guild.fetchMembers())
    let member = guild.members.find(x => x.user.id == author.id)
    let channel = msg.channel;
    let result = await (getHTBRankDetails(channel, author, token));
    if (result != null) {
      let rank = result.rank;
      let htbprofile = guild.channels.find(channel => channel.name === profilePostChannel)
      let defaultRole = guild.roles.find(r => r.name === assignRole);
      let hasRole = member.roles.find(role => role.name == defaultRole.name);
      logger.verbose("API Respone: " + JSON.stringify(result));
      logger.verbose("HasRole: " + (hasRole != null ? hasRole.name : null))
      logger.verbose(rank);
      await (giveRole(bot, member, author, channel, hasRole, defaultRole, result, rank, htbprofile));
    }
  } catch (err) {
    logger.error("New Verify Error:" + err);
  }
})



module.exports.run = async (bot, message, args) => {
  let token = args.filter(arg => arg.length > 20);
  if (token.length == 0) {
    message.channel.send(constant.invalidToken(message.author));
  }
  if (message.channel.type === "dm") {
    newVerifyUser(bot, message, bot.guilds.array().find(x => x.id === guildId), token[0])
  } else {
    message.delete(2000);
    verifyUser(bot, message, token[0])
  }
}


module.exports.config = {
  name: "verify",
  description: "Verify a User",
  usage: `${botTriggerCommand} verify <htb token>`,
  minargs: 1,
  minPermission: "SEND_MESSAGES"
}
