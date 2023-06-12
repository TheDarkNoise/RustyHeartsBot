const { Client, GatewayIntentBits, Partials, Collection } = require(`discord.js`);
const fs = require('fs');
const config = require('./config/config.json');

const client = new Client({ 
  intents: [ 
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent
],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction
],
});

client.commands = new Collection();
client.cooldowns = new Collection();

const functions = fs.readdirSync("./functions").filter(file => file.endsWith(".js"));
const eventFolders = fs.readdirSync("./events")
const commandFolders = fs.readdirSync("./commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handlerError()
    client.handleEvents(eventFolders, "./events");
    client.handleCommands(commandFolders, "./commands");
    client.login(config.Bot_Token)
})();



