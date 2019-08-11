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

module.exports.run = async (bot, message, args) => {
    let msg = await message.channel.send("Generating...")

    let body = await axios.get("https://xkcd.com/info.0.json")
    if(!body.data) return message.channel.send("I broke! Try again.")

        let mEmbed = new Discord.RichEmbed()
        .setColor("#1a85f0")
        .setImage(body.data.img)
        .setTimestamp()

        message.channel.send({embed: mEmbed})

        msg.delete();
}


module.exports.config = {
    name: "xkcd",
    description: "Send the latest xkcd comic!"
  }
