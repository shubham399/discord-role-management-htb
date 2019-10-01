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
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND

module.exports.run = async (bot, message, args) => {
  message.delete(2000);
  logger.verbose(message.member.hasPermission(['BAN_MEMBERS']))
  if (!message.member.hasPermission(["BAN_MEMBERS"])) return message.channel.send("You do not have permission to perform this command!")
  let banMember = message.mentions.members.first() || message.guild.members.get(args[0])
  if (!banMember) return message.channel.send("Please provide a user to ban!")
  if (banMember.id === message.author.id) return message.channel.send('You can\'t ban yourself').then(m => m.delete(5000)); // Check if the user mention or the entered userID is the message author himsmelf
  if (!message.guild.member(banMember).bannable) return message.reply(`You can\'t ban this user. because ${botTriggerCommand} doesnot have sufficient permissions!`).then(m => m.delete(5000)); // Check if the user is bannable with the bot's permissions
  let reason = args.slice(1).join(" ");
  if (!reason) reason = "No reason given!"
  logger.verbose("Softban Reason" + reason);
  if (!message.guild.me.hasPermission(["BAN_MEMBERS"])) return message.channel.send("I dont have permission to perform this command")
  banMember.send(`Hello, you have been banned from ${message.guild.name} for: ${reason}`).then(() =>
    message.guild.ban(banMember, {
      days: 1,
      reason: reason
    })).then(() => message.guild.unban(banMember.id, {
    reason: "Softban"
  })).catch(err => console.log(err))
  message.channel.send(`**${banMember.user.tag}** has been banned`).then(m => m.delete(5000))
  let embed = new Discord.RichEmbed()
    .setColor("#f0d31a")
    .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
    .addField("Moderation:", "SoftBan")
    .addField("Moderator:", message.author.username)
    .addField("User: ", banMember.displayName)
    .addField("Reason:", reason)
    .addField("Date:", message.createdAt.toLocaleString())
  let sChannel = message.guild.channels.find(c => c.name === actionLog)
  sChannel.send(embed)
}

module.exports.config = {
  name: "softban",
  description: "SoftBans a user from the guild!",
  usage: `${botTriggerCommand} softban <username> <Reason(options)>`,
  minargs: 1,
  minPermission: "BAN_MEMBERS"
}
