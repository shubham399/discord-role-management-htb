const logger = require("../log.js").logger
const axios = require("axios");
const R = require('ramda');
const Discord = require("discord.js");
const constant = require("../constant.js");
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const profilePostChannel = process.env.PROFILE_CHANNEL;
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND;
const assignRole = process.env.ASSIGN_ROLE;

module.exports.sendHelp = async (user,channel) => {
  let welcome = new Discord.RichEmbed()
  .setTitle(`Welcome! ${user.username || user.displayName}. Lets get you verified`)
  let step1 = new Discord.RichEmbed()
  .setTitle("Step 1: Log in to your HackTheBox Account")
  .setDescription("Go to  https://hackthebox.eu/home/settings")

  let step2 = new Discord.RichEmbed()
  .setTitle("Step 2: Locate the identification key")
  .attachFiles(["./images/ai.png"])
  .setImage('attachment://ai.png')
  .setDescription("In the Settings tab, you should be able to identify a field called \"Accont identifier\",click on the green button to copt the string.")

  let step3 = new Discord.RichEmbed()
  .setTitle("Step 3: Verify ")
  .setDescription(`Procced to send the bot your account identification string by: \`${botTriggerCommand} verify <string>\` in ${channel}`)

  let step4 = new Discord.RichEmbed()
  .setTitle("Enjoy")
  .setDescription("If we are able to verify the token properly we will give you the role :)")

  await(user.send(welcome));
  await(user.send(step1));
  await(user.send(step2));
  await(user.send(step3));
  await(user.send(step4));
}
