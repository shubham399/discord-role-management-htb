const logger = require("../log.js").logger
const axios = require("axios");
const R = require('ramda');
const constant = require("../constant.js");
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const profilePostChannel = process.env.PROFILE_CHANNEL;
const assignRole = process.env.ASSIGN_ROLE;

const getUserData = (token) => {
  logger.debug(token)
  logger.debug(constant.htburl + token)
  return axios.get(constant.htburl + token)
};

const verifyUser = async (function(msg, token) {
  try {
    let author = msg.author;
    let member = msg.member;
    let channel = msg.channel;
    let result = null;
    try {
      result = await (getUserData(token)).data;
    } catch (error) {
      logger.error("Axios Error:" + error);
      logger.error(error);
      if (R.path(["response", "status"], error) === 404) {
        channel.send(constant.invalidToken(author))
      } else {
        channel.send(constant.htbFailure(author))
      }
    }
    let rank = result.rank;
    let htbprofile = msg.guild.channels.find(channel => channel.name === profilePostChannel)
    let defaultRole = member.guild.roles.find(r => r.name === assignRole);
    let hasRole = member.roles.find(role => role.name == defaultRole.name);
    logger.debug("API Respone: " + JSON.stringify(result));
    logger.debug("HasRole: " + (hasRole != null ? hasRole.name : null))
    logger.debug(rank);
    if (!hasRole) {
      logger.info(author.username + " htb rank is " + rank + " and giving it role " + defaultRole.name);
      member.addRoles([defaultRole]).then(r => {
        htbprofile.send(constant.profile(author, result.user_id)).catch(err => console.error(err))
        channel.send(constant.success(author))
      }).catch((e) => {
        logger.error("Error:" + e);
        channel.send(constant.unableToaddRole(author))
      });
    } else {
      logger.verbose(author.username + " already have the role.");
      await (channel.send(constant.alreadyVerified(author)));
    }
  } catch (error) {
    logger.error("adding verify:" + error);
    msg.author.send(constant.dmFailure("#bot-spam"));
  } finally {
    try {
      await (msg.delete());
    } catch (error) {
      logger.error("Message Delete:" + error);
    }
  }
});

module.exports.verifyUser = verifyUser;
