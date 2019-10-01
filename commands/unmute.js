const axios = require("axios");
const R = require('ramda');
const Discord = require("discord.js");
const constant = require("../constant.js");
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const profilePostChannel = process.env.PROFILE_CHANNEL;
const assignRole = process.env.ASSIGN_ROLE;
const logger = require("../log.js").logger;
const actionLog = process.env.ACTION_LOG || "action-log";
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND

module.exports.run = async (bot, message, args) => {
  message.delete(2000);
  if (!message.member.hasPermission("MANAGE_ROLES") || !message.guild.owner) return message.channel.send("You dont have permission to use this command.");
  if (!message.guild.me.hasPermission(["MANAGE_ROLES"])) return message.channel.send("I don't have permission to add roles!")
  //define the reason and unmutee
  let mutee = message.mentions.members.first() || message.guild.members.get(args[0]);
  if (!mutee) return message.channel.send("Please supply a user to be muted!");
  let reason = args.slice(1).join(" ");
  if (!reason) reason = "No reason given"
  //define mute role and if the mute role doesnt exist then send a message
  let muterole = mutee.roles.find(r => r.name === "VerifedMuted")
  if (!muterole) {
    muterole = mutee.roles.find(r => r.name === "Muted")
    if (!muterole)
      return message.channel.send("There is no mute role to remove!")
  }
  //remove role to the mentioned user and also send the user a dm explaing where and why they were unmuted
  mutee.removeRole(muterole.id).then(() => {
    if (muterole.name === "VerifedMuted") {
      let defaultRole = message.guild.roles.find(r => r.name === assignRole)
      mutee.addRole(defaultRole.id)
    }
    mutee.send(`Hello, you have been unmuted in ${message.guild.name} for: ${reason}`).catch(err => console.log(err))
    message.channel.send(`${mutee.user.username} was unmuted!`)
  })
  //send an embed to the modlogs channel
  let embed = new Discord.RichEmbed()
    .setColor("RED")
    .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
    .addField("Moderation:", "unmute")
    .addField("Mutee:", mutee.user.username)
    .addField("Moderator:", message.author.username)
    .addField("Reason:", reason)
    .addField("Date:", message.createdAt.toLocaleString())
  let sChannel = message.guild.channels.find(c => c.name === actionLog)
  sChannel.send(embed)

}


module.exports.config = {
  name: "unmute",
  description: "Unmutes a member in the discord!",
  usage: `${botTriggerCommand} unmute <username> <Reason(options)>`,
  minargs: 1,
  minPermission: "MANAGE_ROLES"
}
