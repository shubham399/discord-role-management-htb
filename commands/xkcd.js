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
const xkcd = require('xkcd-api');

module.exports.run = async (bot, message, args) => {
  message.delete(2000);
  let msg = await message.channel.send("Generating...")
  let method = args[0];
  var body = null;
  if (method === 'random') {
    xkcd.random(function(error, response) {
      if (error) {
        logger.error("xkcd Error" + error);
        message.channel.send("I broke! Try again.")
      } else {
        sendxkcd(bot, message, msg, response);
      }
    });
  } else {
    xkcd.latest(function(error, response) {
      if (error) {
        logger.error("xkcd Error" + error);
        message.channel.send("I broke! Try again.")
      } else {
        sendxkcd(bot, message, msg, response);
      }
    });
  }
}

function sendxkcd(bot, message, msg, body) {
  let mEmbed = new Discord.RichEmbed()
    .setColor("#1a85f0")
    .setImage(body.img)
    .setTimestamp()
  message.channel.send({
    embed: mEmbed
  })
  msg.delete();
}


module.exports.config = {
  name: "xkcd",
  description: "Send the latest xkcd comic!",
  usage: `${botTriggerCommand} xkcd <random(optional)>`
}
