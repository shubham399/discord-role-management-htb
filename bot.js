const token = process.env.DISCORD_TOKEN;
const assignRole = process.env.ASSIGN_ROLE;
const botTriggerCommand = process.env.BOT_TRIGGER_COMMAND;
const Discord = require("discord.js");
const request = require("request");
const client = new Discord.Client();
const logger = require("./log.js").logger


client.on("ready", () => {
  logger.info("Bot is Ready")
});
client.on("message", (msg) => {
  try {
    var commandArray = msg.content.split(" ")
    if (commandArray[0].toLowerCase() === botTriggerCommand) {
      const subCommand = commandArray[1] == undefined ? "default" : commandArray[1].toLowerCase();
      logger.info(msg.author.username + " is executing " + subCommand);
      switch (subCommand) {
        case "default":
          msg.channel.send("type ``badgers help`` to see how to use");
          break;
        case "help":
          msg.channel.send("type `badgers identify` to Verify yourself.");
          break;
        case "identify":
          msg.author.send("Hey Lets Get you verified, Go grab the identification token from HTB from https://hackthebox.eu/home/settings and paste `badgers verify <token>` in " + msg.channel);
          break;
        case "verify":
          verifyUser(msg, commandArray[2])
          msg.delete();
          break;
        default:
          msg.channel.send("Command Unkown")

      }
    }
  } catch (error) {
    console.error(error)
  }
})
// Start and login the bot
client.login(token);

function verifyUser(msg, token) {
  try {
    let author = msg.author
    let member = msg.member
    let channel = msg.channel
    request('https://www.hackthebox.eu/api/users/identifier/' + token, {
      json: true
    }, (err, res, body) => {
      if (err) {
        logger.error(err);
        channel.send("Unable to connect to HTB server" + author)
      }
      logger.debug(body);
      var rank = null;
      try {
        rank = body.rank.replace(/ /g, '')
      } catch (err) {
        logger.error("Rank: " + err);
        channel.send("Invalid token " + author + " Please try with the proper one.")
      }
      if (rank != null) {
        //           var roles = member.guild.roles.filter(r => r.name.includes("HTB-"))
        try{
        const htbprofile = msg.guild.channels.find(channel => channel.name === 'htb-profiles')
        var defaultRole = member.guild.roles.find(r => r.name === assignRole );
        var hasRole = member.roles.find(role => {
          return role.name == defaultRole.name
        });
        }catch(error){
           msg.author.send("Send the badger verify in the channel");
           logger.error("Error:" + error);
        }
        logger.debug("HasRole: " + (hasRole != null ? hasRole.name:null))
        if (hasRole == null) {
          // var role = member.guild.roles.find(r => r.name.includes("-" + rank))
          logger.info(author.username + " htb rank is " + rank + " and giving it role " + defaultRole.name);
          if (defaultRole != null)
            member.addRoles([defaultRole]).then(r => {
              htbprofile.send(author + ' HTB Profile: https://www.hackthebox.eu/home/users/profile/' + body.user_id).catch(err => console.error(err))
              channel.send("Congratulation! " + author + " you are verified now :thumbsup: .")
            }).catch(e => channel.send("Unable to add proper role " + author + " Please try again later."));
        } else {
          logger.info(author.username + " already have the role.");
          channel.send("You are already verified " + author + " :thumbsup: .")
        }
      }
    });
  } catch (error) {
    logger.error("Error:" + error);
  }
}
