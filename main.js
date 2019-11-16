const Discord = require('discord.js')
const token = process.env.DISCORD_TOKEN
const app = require('./src/app')
const client = new Discord.Client()

app(client, token)
