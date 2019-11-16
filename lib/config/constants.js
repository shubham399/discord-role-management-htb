'use strict'
exports.botReady = (bot) => `${bot} is Ready.`
exports.default = (bot) => `type \`\`${bot} help\`\` to see how to use`
exports.unkown = 'Invalid! Command, Please try with a proper command'
exports.htburl = 'https://www.hackthebox.eu/api/users/identifier/'
exports.dmFailure = (channel) => `Send the badger verify in the ${channel}`
exports.htbFailure = (author) => `Unable to connect to HTB server ${author}`
exports.invalidToken = (author) => `Invalid token ${author} Please try with the proper one.`
exports.profile = (author, userid) => `${author} HTB Profile: https://www.hackthebox.eu/home/users/profile/${userid}`
exports.success = (author) => `Congratulation! ${author} you are verified now :thumbsup: .`
exports.unableToaddRole = (author) => `Unable to add role ${author}. Please try again later.`
exports.alreadyVerified = (author) => `Roles Updated for ${author} :thumbsup:.`
exports.notUpdatedNonHTB = (author) => `You are already Verified with HTB ${author} :thumbsup:.`
