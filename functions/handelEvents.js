const fs = require("node:fs");
const chalk = require("chalk");

module.exports = (client) => {
    client.handleEvents = async (eventFiles, path) => {
        
        const eventFolders = fs.readdirSync("./events");
        for (const folder of eventFolders) {

            const eventFiles = fs
            .readdirSync(`./events/${folder}`)
            .filter((file) => file.endsWith(".js"));
            
            for (const file of eventFiles) {
                const event = require(`../events/${folder}/${file}`);

            if (event.name) {
                console.log(chalk.greenBright(` ✔️  => ${file} Event loaded.`));
            } else {
                console.log(chalk.redBright(` ❌  => ${file} Event not loaded.`));
                continue;
            }

            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }}
    };
}