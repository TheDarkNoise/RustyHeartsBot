const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const chalk = require("chalk");
const config = require('../config/config.json')

const clientId = config.Client_ID; 

module.exports = (client) => {
    client.handleCommands = async () => {

        const commandFolders = fs.readdirSync("./commands");

        client.commandArray = [];
        for (const folder of commandFolders) {

            const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            }
        }

        const rest = new REST({
            version: '9'
        }).setToken(config.Bot_Token);

        (async () => {
            try {
                console.log(chalk.yellowBright('Started refreshing application (/) commands.'));

                await rest.put(
                    Routes.applicationCommands(clientId), {
                        body: client.commandArray
                    },
                );

                console.log(chalk.greenBright('Successfully reloaded application (/) commands.'));
            } catch (error) {
                console.error(error);
            }
        })();
    };
};