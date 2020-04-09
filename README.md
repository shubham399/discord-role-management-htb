# Discord Bot


Initially started as an HTB Role management bot. Now it have many other features.



## How to run it locally or host it yourself?

Let's get started

* create a discord token, You can create an application on https://discordapp.com/developers/applications and get the token from bot menu

* (Optional) You might need an youtube api key if you want to use `youtube` feature i.e ippsec command which search youtube for ippsec video

* (Optional) Redis setup a redis-server for the `remind` feature and caching other things like ippsec video link.

* Create an `.env` file to run locally or set ENV variables if running on any `VPS`

  * You need `Procfile` only if you want to run on `heroku`


## Environment variables

Here is the list of Environment Variables

* `DISCORD_TOKEN`: Set this as the discord token which you got from the discord developers page

* `BOT_TRIGGER_COMMAND`: The trigger command you want to use you can also keep prefix here

* `BOT_TRIGGER_PREFIX_LIST`: Additional Prefix you want the bot to response with (*Optional*)

* `LOG_LEVEL`: To set the logging level default is `verbose` you can set it to `info` in production environment

* `PROFILE_CHANNEL`: set this to the channel where you want the verified `HTB` users profile link has to be sent

* `ASSIGN_ROLE`: The Role you want to give when the verification is successful. You can also have Roles named as the HTB Rank to give those roles too.

* `GUILD_ID`: Needed for working from bot Direct message and giving the role on your server. Get it from Server widget -> `Server ID`

* `REDIS_URL`: Redis URL for Caching (Optional) might make some functions not to work properly

* `REMIND_IGNORE_LIST`: List of user whom you don't want to send reminder when running `remind` command

* `GRACE_PERIOD`: To only remind someone when if not remined for these many days

* `NODE_ENV`: Node Environment Version prod/uat

* `YOUTUBE_KEY`: Youtube API key

There are more you will update it later you can find it in the code

### How to Start ?

If you have set the environment variables you can run install the dependencies via

```shell
npm i
```
when you are in the current directory.

and running it locally via

```shell
npm run dev
```

and
```shell
npm start
```
in production environment

**NOTE:** You need to have `.env` in the project root directory.

If you get a message like
```
time host info: discordbot is Ready.
```


Then your bot is running.


### Inviting the bot to your server

Go back to https://discordapp.com/developers/applications page and go to `oauth` page and click the scope as `bot` and bot permissions as `Administrator` and copy and open that link and Authorize it.


You should have the bot invited to your server and you can try running any command like `bottigger usage`.




### Have any issue or any feature request?

Create a Github issue with your issue or feature request.


You can also create a PR for any feature you want to be included here.


### License

 MIT License

### Contact
Still having issue?

contact me on discord at `f3v3r#1168`



### Like


Like this project and want to support me?

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/shubham399)

<a href="https://www.buymeacoffee.com/f3v3r" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/lato-orange.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" ></a>
