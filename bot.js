const token = process.env.DISCORD_TOKEN;
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND;
const Discord = require("discord.js");
const client = new Discord.Client();
const logger = require("./log.js").logger
const constant = require("./constant.js")
const verifyUser = require("./commands/userVerify.js").verifyUser
const ban = require("./commands/ban").ban
const softban = require("./commands/ban").ban
const sendHelp = require("./commands/help").sendHelp

client.on("ready", () => {
  logger.info(constant.botReady(botTriggerCommand))
});

client.on("message", (msg) => {
  try {
    var commandArray = msg.content.split(" ")
    let args = commandArray.slice(1);
    if (commandArray[0].toLowerCase() === botTriggerCommand) {
      const subCommand = commandArray[1] == undefined ? "default" : commandArray[1].toLowerCase();
      logger.info(msg.author.username + " is executing " + subCommand);
      switch (subCommand) {
        case "default":
          msg.channel.send(constant.default(botTriggerCommand));
          break;
        case "help":
          sendHelp(msg.author,msg.channel)
          break;
        case "verify":
          verifyUser(msg, commandArray[2])
          break;
        case "softban":
          softban(client,msg, args)
          break;
        case "ban":
          ban(client,msg, args)
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
    sendHelp(member,client.channels.find(channel=> channel.name === "bot-spam"))

});



client.login(token);
