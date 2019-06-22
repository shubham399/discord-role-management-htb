const token= process.env.DISCORD_TOKEN;
const args = message.content.split(' ').slice(1); // All arguments behind the command name with the prefix
const user = message.mentions.users.first(); // returns the user object if an user mention exists
const banReason = args.slice(1).join(' '); // Reason of the ban (Everything behind the mention)
const Discord = require("discord.js");
const request = require("request");
const client = new Discord.Client();
const http = require('http');
const port = process.env.PORT || 4000;
http.createServer((req, res) => {
res.writeHead(200, {
    'Content-type': 'text/plain'
});
    res.write('Hey');
    res.end();
}).listen(port);
client.on("ready",()=>{
  console.log("Bot Ready")
});
client.on("message",(msg)=>{
  try{
    var commandArray = msg.content.split(" ")
    // console.log(type(msg.content))
  if( commandArray[0] === "badgers"){
    console.log(commandArray[1]);
    switch(commandArray[1])
    {
      case undefined:
        msg.channel.send("type ``badgers help`` to see how to use");
        break;
      case "help":
        msg.channel.send("type `badgers identify` to Verify yourself.");
        break;
      case "identify":
        msg.author.send("Hey Lets Get you verified, Go grab the identification token from HTB from https://hackthebox.eu/home/settings and paste `badgers verify <token>` in "+msg.channel);
        break;
      case "verify":
        verifyUser(msg,commandArray[2])
        msg.delete();
        break;
      default: msg.channel.send("Command Unkown")

    }
}
}
catch(error){
  console.error(error)
}
})
// Start and login the bot
client.login(token);

function verifyUser(msg,token){
  let author = msg.author
  let member = msg.member
  let channel = msg.channel
  
  // Check if an user mention exists in this message
if (!user) {
try {
// Check if a valid userID has been entered instead of a Discord user mention
if (!message.guild.members.get(args.slice(0, 1).join(' '))) throw new Error('Couldn\' get a Discord user with this userID!');
// If the client (bot) can get a user with this userID, it overwrites the current user variable to the user object that the client fetched
user = message.guild.members.get(args.slice(0, 1).join(' '));
user = user.user;
} catch (error) {
return message.reply('Couldn\' get a Discord user with this userID!');
}
}
if (user === message.author) return message.channel.send('You can\'t ban yourself'); // Check if the user mention or the entered userID is the message author himsmelf
if (!reason) return message.reply('You forgot to enter a reason for this ban!'); // Check if a reason has been given by the message author
if (!message.guild.member(user).bannable) return message.reply('You can\'t ban this user because you the bot has not sufficient permissions!'); // Check if the user is bannable with the bot's permissions


request('https://www.hackthebox.eu/api/users/identifier/'+ token, { json: true }, (err, res, body) => {
  if (err) {
    console.log(err);
    channel.send("Unable to connect to HTB server"+author)
   }
   var rank = null;
   try{

   rank = body.rank.replace(/ /g,'')}
  catch(err){
  console.error(err);
    channel.send("Invalid token "+author+" Please try with the proper one.")
  }
  var role = member.guild.roles.find(r =>r.name.includes("-"+rank))
  if (role != null)
  member.addRole(role).catch(e => channel.send("Unable to add proper role "+author+" Please try again later."));
});

}
