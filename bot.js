const token = process.env.DISCORD_TOKEN;
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND;
const Discord = require("discord.js");
const client = new Discord.Client();
const logger = require("./log.js").logger
const constant = require("./constant.js")
const verifyUser = require("./commands/userVerify.js").verifyUser
const ban = require("./commands/ban").ban
const softban = require("./commands/ban").ban

client.on("ready", () => {
  logger.info(constant.botReady(botTriggerCommand))
});

client.on("message", (msg) => {
  try {
    var commandArray = msg.content.split(" ")
    if (commandArray[0].toLowerCase() === botTriggerCommand) {
      const subCommand = commandArray[1] == undefined ? "default" : commandArray[1].toLowerCase();
      logger.info(msg.author.username + " is executing " + subCommand);
      switch (subCommand) {
        case "default":
          msg.channel.send(constant.default(botTriggerCommand));
          break;
        case "help":
          msg.author.send(constant.help(botTriggerCommand, msg.channel),{files:["./images/ai.png"]});
          break;
        case "verify":
          verifyUser(msg, commandArray[2])
          break;
        case "softban":
          softban(client,msg, commandArray)
          break;
        case "ban":
          ban(client,msg, commandArray)
          break;
        default:
          msg.channel.send(constant.unkown)

      }
    }
  } catch (error) {
    console.error(error)
  }
})
// Start and login the bot
client.on('guildMemberAdd', member => {
     member.send("Welcome to the server!");
     member.send(constant.help(botTriggerCommand, '#bot-spam'),{files:["./images/ai.png"]});

});
client.login(token);
