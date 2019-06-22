const token= process.env.DISCORD_TOKEN;
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
  if( commandArray[0] === "!htb"){
    console.log(commandArray[1]);
    switch(commandArray[1])
    {
      case undefined:
        msg.channel.send("type `!htb help` to see how to use");
        break;
      case "help":
        msg.channel.send("type `!htb identify` to Verify yourself.");
        break;
      case "identify":
        msg.author.send("Hey Lets Get you verified, Go grab the identification token from HTB from https://hackthebox.eu/home/settings and paste `!htb verify <token>` in "+msg.channel);
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
