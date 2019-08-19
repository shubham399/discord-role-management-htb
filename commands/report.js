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
const reportChannel = process.env.REPORT_CHANNEL;

module.exports.run = async (bot, message, args) => {
   message.delete(2000);
   let defaultRole = message.member.guild.roles.find(r => r.name === assignRole);
   let hasRole = message.member.roles.find(role => role.name == defaultRole.name);
   if(!hasRole) return message.channel.send("You don't have permission to Report other users.")
   let reportMember = message.mentions.members.first() || message.guild.members.get(args[0])
   let reason = args.slice(2).join(" ");
   if(!reason) reason = "No reason given!"
   logger.verbose("Report Reason" + reason);
   message.channel.send(`**${reportMember.user.tag}** has been Reported`).then(m => m.delete(5000))
    let embed = new Discord.RichEmbed()
    .setColor("#bc0000")
    .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
    .addField("Moderation:", "Report")
    .addField("Moderator:", message.author.username)
    .addField("User: ",reportMember.displayName)
    .addField("Reason:", reason)
    .addField("Date:", message.createdAt.toLocaleString())
    let sChannel = message.guild.channels.find(c => c.name === reportChannel)
    sChannel.send(embed)

}

module.exports.config = {
    name: "report",
    description: "Report a user to guild staffs.",
    usage:`${botTriggerCommand} report <username> <Reason(options)>`
}
