const token = process.env.DISCORD_TOKEN;
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND;
const Discord = require("discord.js");
const client = new Discord.Client();
const logger = require("./log.js").logger
const constant = require("./constant.js")
const sendHelp = require("./commands/help").sendHelp
const actionLog = process.env.ACTION_LOG || "action-log";

const fs = require("fs");
client.commands = new Discord.Collection();
client.config = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err)
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0) {
         return console.log("[LOGS] Couldn't Find Commands!");
    }
    jsfile.forEach((f, i) => {
        let pull = require(`./commands/${f}`);
        client.commands.set(pull.config.name, pull);
        client.config.set(pull.config.name, pull.config);
    });
});

client.on("ready", () => {
  logger.info(constant.botReady(botTriggerCommand))
});

client.on("message", (message) => {
    let messageArray = message.content.split(" ").filter(x=> x !== "");
    if (messageArray.length == 0) return;
    let trigger = messageArray[0].toLowerCase();
    if(trigger !== botTriggerCommand) return;
    logger.verbose(messageArray);
    let cmd = messageArray.length > 1 ? messageArray[1].toLowerCase() : null;
    logger.info(message.author.username + " is executing " + cmd);
    if((message.author.bot || message.channel.type === "dm") && cmd !== "verify") return;
    let args = messageArray.slice(2);
    if (cmd == null) {
        message.channel.send(constant.default(botTriggerCommand));
        return;
    }
    let commandFile = client.commands.get(cmd);
    if(commandFile) commandFile.run(client,message,args);
})
// Start and login the bot
client.on('guildMemberAdd', member => {
    logger.info(member.displayName +" joined the server.")
    let embed = new Discord.RichEmbed()
      .setColor("#5780cd")
      .setTitle("New User Joined.")
      .setDescription(member.displayName + " joined the server.")
      // .setFooter("Date:", message.createdAt.toLocaleString())
    let sChannel = client.channels.find(c => c.name === actionLog)
    sChannel.send(embed)
    member.send("Welcome to the server!");
    sendHelp(member,client.channels.find(channel=> channel.name === "bot-spam"))

});

client.on('guildMemberRemove', member => {
    logger.info(member.displayName +" joined the server.")
    let embed = new Discord.RichEmbed()
      .setColor("#5780cd")
      .setTitle("Member Left.")
      .setDescription(member.displayName + " left the server.")
      // .setFooter("Date:", message.createdAt.toLocaleString())
    let sChannel = client.channels.find(c => c.name === actionLog)
    sChannel.send(embed)
    member.send("We are sorry to see you.");
    // sendHelp(member,client.channels.find(channel=> channel.name === "bot-spam"))

});



client.login(token);
