const logger = require("../log.js").logger
const axios = require("axios");
const R = require('ramda');
const Discord = require("discord.js");
const constant = require("../constant.js");
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const profilePostChannel = process.env.PROFILE_CHANNEL;
const assignRole = process.env.ASSIGN_ROLE;
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND;
const listRole = process.env.LIST_ROLE || "STAFF";

module.exports.run = async (bot, message, args) => {
  try {
    let embed = new Discord.RichEmbed()
      .setColor("#5780cd")
      .setTitle("Server Info")
      .setThumbnail(message.guild.iconURL)
      .setAuthor(`${message.guild.name} Info`, message.guild.iconURL)
      .addField("**Guild Name:**", `${message.guild.name}`, true)
      .addField("**Guild Owner:**", `${message.guild.owner}`, true)
      .addField("**Member Count:**", `${message.guild.members.filter(member => !member.user.bot).size}`, true)
      .addField("**Verified Member Count:**", `${message.guild.members.filter(member =>{
      let defaultRole = member.guild.roles.find(r => r.name === assignRole);
      let hasRole = member.roles.find(role => role.name == defaultRole.name);
      return hasRole
    }).size}`, true)
      .addField(`**${listRole} Count:**`, `${message.guild.members.filter((member,result) =>{
    let defaultRole = member.guild.roles.find(r => r.name === listRole);
    let hasRole = member.roles.find(role => role.name == defaultRole.name);
    return hasRole
  }).size}`, true)
      .addField(`**${listRole} List:**`, `${message.guild.members.filter((member,result) =>{
    let defaultRole = member.guild.roles.find(r => r.name === listRole);
    let hasRole = member.roles.find(role => role.name == defaultRole.name);
    return hasRole
  }).map(member => member.displayName)}`, true)
      .addField("**Channels Count:**", `${message.guild.channels.size}`, true)
      .addField("**Role Count:**", `${message.guild.roles.size}`, true)
      .addField("**Role List:**", `${message.guild.roles.map(role=>role.name)}`, true)
      .setFooter(`${botTriggerCommand}`, bot.user.displayAvatarURL);
    await (message.channel.send({
      embed
    }));
  } catch (err) {
    logger.error(err);
  }
}

module.exports.config = {
  name: "serverinfo",
  description: "Get Server Info.",
  usage: `${botTriggerCommand} serverinfo`
}
