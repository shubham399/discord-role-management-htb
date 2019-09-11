const actionLog = process.env.ACTION_LOG || "action-log";



module.exports.sendActionLog = function(bot, message) {
  let sChannel = bot.channels.find(c => c.name === actionLog)
  sChannel.send(message)
}
