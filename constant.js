exports.botReady = (bot) =>`${bot} is Ready.`
exports.default = (bot) =>`type \`\`${bot} help\`\` to see how to use`
exports.help = (bot,channel) =>`Hey Lets Get you verified, Go grab the identification token from HTB from https://hackthebox.eu/home/settings and paste \`${bot} verify <token>\` in ${channel}`
exports.unkown = "Invalid! Command, Please try with a proper command"
exports.htburl = 'https://www.hackthebox.eu/api/users/identifier/'
exports.dmFailure = (channel) => `Send the badger verify in the ${channel}`
exports.htbFailure = (author) => `Unable to connect to HTB server ${author}`
exports.invalidToken = (author) => `Invalid token ${author} Please try with the proper one.`
exports.profile = (author,userid) => `${author} HTB Profile: https://www.hackthebox.eu/home/users/profile/${userid}`
exports.success = (author) => `Congratulation! ${author} you are verified now :thumbsup: .`
exports.unableToaddRole = (author) => `Unable to add role ${author}. Please try again later.`
exports.alreadyVerified = (author) => `You are already verified ${author} :thumbsup: .`
