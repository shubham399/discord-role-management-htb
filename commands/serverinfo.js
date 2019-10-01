const logger = require("../log.js").logger
const axios = require("axios");
const R = require('ramda');
const Discord = require("discord.js");
const constant = require("../constant.js");
const uptime = require("./uptime.js");
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const profilePostChannel = process.env.PROFILE_CHANNEL;
const assignRole = process.env.ASSIGN_ROLE;
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND;
const nonHTBRole = process.env.NON_HTB_ROLE || "Non-HTB Verified"
const listRole = process.env.LIST_ROLE || "STAFF";

module.exports.run = async (bot, message, args) => {
  message.delete(2000);
  try {
    let banNumbers = await message.guild.fetchBans()
    let embed = new Discord.RichEmbed()
      .setColor("#5780cd")
      .setTitle("Server Info")
      .setThumbnail(message.guild.iconURL)
      .setAuthor(`${message.guild.name} Info`, message.guild.iconURL)
      .addField("**Guild Name:**", `${message.guild.name}`, true)
      .addField("**Guild Owner:**", `${message.guild.owner}`, true)
      .addField("**Guild Region:**", `${message.guild.region}`, true)
      .addField("**Guild Verified:**", `${message.guild.verified}`, true)
      .addField("**Member Count:**", `${message.guild.memberCount}`, true)
      .addField(`**${assignRole} Count:**`, `${message.guild.members.filter(member =>{
      let hasRole = member.roles.find(role => role.name == assignRole);
      return hasRole
    }).size}`, true)
      .addField(`**${nonHTBRole} Member Count:**`, `${message.guild.members.filter(member =>{
      let hasRole = member.roles.find(role => role.name == nonHTBRole);
      return hasRole
    }).size}`, true)
      .addField("**Dead Account Member Count:**", `${message.guild.members.filter(member =>{
      let hasRole = member.roles.find(role => role.name == "DeadAccount");
      return hasRole
    }).size}`, true)
      .addField(`**${listRole} Count:**`, `${message.guild.members.filter((member,result) =>{
    let hasRole = member.roles.find(role => role.name == listRole);
    return hasRole
  }).size}`, true)
      .addField(`**${listRole} List:**`, `${message.guild.members.filter((member,result) =>{
    let hasRole = member.roles.find(role => role.name == listRole);
    return hasRole
  }).map(member => member.displayName)}`, true)
      .addField("**Channels Count:**", `${message.guild.channels.size}`, true)
      .addField("**Role Count:**", `${message.guild.roles.size}`, true)
      .addField("**Role List:**", `${message.guild.roles.map(role=>role.name)}`, true)
      .addField("**Ban Members Size**", `${banNumbers.size}`, true)
      .setFooter(`${botTriggerCommand}`, bot.user.displayAvatarURL);
    await (message.channel.send({
      embed
    }));
    await (uptime.run(bot, message, args));
  } catch (err) {
    logger.error(err);
  }
}

module.exports.config = {
  name: "serverinfo",
  description: "Get Server Info.",
  usage: `${botTriggerCommand} serverinfo`,
  minargs: 0,
  minPermission: "SEND_MESSAGES"
}
