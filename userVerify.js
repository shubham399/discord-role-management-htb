const logger = require("./log.js").logger
const request = require("request");
const constant = require("./constant.js")
const profilePostChannel = process.env.PROFILE_CHANNEL;
const assignRole = process.env.ASSIGN_ROLE;

function verifyUser(msg, token) {
  try {
    let author = msg.author
    let member = msg.member
    let channel = msg.channel
    request(constant.htburl + token, {
      json: true
    }, (err, res, body) => {
      if (err) {
        logger.error(err);
        channel.send(constant.htbFailure(author))
      }
      logger.debug(body);
      var rank = null;
      try {
        rank = body.rank.replace(/ /g, '')
      } catch (err) {
        logger.error("Rank: " + err);
        channel.send(constant.invalidToken(author))
      }
      if (rank != null) {
        try{
        var htbprofile = msg.guild.channels.find(channel => channel.name === profilePostChannel)
        var defaultRole = member.guild.roles.find(r => r.name === assignRole );
        var hasRole = member.roles.find(role => {
          return role.name == defaultRole.name
        });
        }catch(error){
           msg.author.send(constant.dmFailure);
           logger.error("Error:" + error);
           console.error( error);
        }
        logger.debug("HasRole: " + (hasRole != null ? hasRole.name:null))
        if (hasRole == null) {
          if (defaultRole != null){
           logger.info(author.username + " htb rank is " + rank + " and giving it role " + defaultRole.name);
            member.addRoles([defaultRole]).then(r => {
              htbprofile.send(constant.profile(author,body.user_id)).catch(err => console.error(err))
              channel.send(constant.success(author))
            }).catch((e)=>{
              logger.error("Error:" +e);
              channel.send(constant.unableToaddRole(author))});
        }
        } else {
          logger.info(author.username + " already have the role.");
          channel.send(constant.alreadyVerified(author))
        }
      }
    });
  } catch (error) {
    logger.error("Error:" + error);
  }
}
module.exports.verifyUser = verifyUser;
