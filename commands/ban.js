const logger = require("../log.js").logger
const axios = require("axios");
const R = require('ramda');
const Discord = require("discord.js");
const constant = require("../constant.js");
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const profilePostChannel = process.env.PROFILE_CHANNEL;
const assignRole = process.env.ASSIGN_ROLE;


module.exports.ban = async (bot, message, args) => {

   if(!message.member.hasPermission(["BAN_MEMBERS"])) return message.channel.send("You do not have permission to perform this command!")

   let banMember = message.mentions.members.first() || message.guild.members.get(args[0])
   if(!banMember) return message.channel.send("Please provide a user to ban!")

   let reason = args.slice(2).join(" ");
   if(!reason) reason = "No reason given!"
   logger.verbose("Softban Reason" + reason);
   if(!message.guild.me.hasPermission(["BAN_MEMBERS"])) return message.channel.send("I dont have permission to perform this command")

   banMember.send(`Hello, you have been banned from ${message.guild.name} for: ${reason}`).then(() =>
   message.guild.ban(banMember, { days: 1, reason: reason})).catch(err => console.log(err))

   message.channel.send(`**${banMember.user.tag}** has been banned`).then(m => m.delete(5000))

    let embed = new Discord.RichEmbed()
    .setColor("#bc0000")
    .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
    .addField("Moderation:", "ban")
    .addField("Moderator:", message.author.username)
    .addField("User: ",banMember.displayName)
    .addField("Reason:", reason)
    .addField("Date:", message.createdAt.toLocaleString())

        let sChannel = message.guild.channels.find(c => c.name === "badgers-mod")
        sChannel.send(embed)

}
