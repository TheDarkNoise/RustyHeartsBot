const { Interaction, EmbedBuilder, WebhookClient, Collection } = require("discord.js");
const { inspect } = require("util");
const config = require('../../config/config.json')
const webhook = new WebhookClient({ url: config.Logs_Error });

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return

        const { cooldowns } = client;

        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }
    
        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const defaultCooldownDuration = 3;
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;
    
        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
    
            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000);
                return interaction.reply({ 
                    embeds: [
                        new EmbedBuilder()
                        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                        .setDescription(`Please Wait, you are on a cooldown to use \`${command.data.name}\`. Time left <t:${expiredTimestamp}:R>.`)
                        .setColor("Red")
                      ], ephemeral: true
                 });
            }
        }
    
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    
        try{

            await command.execute(interaction, client);
            
        }catch (error) {
            console.log(error);
            await interaction.reply({
                content: 'There was an error while executing this command!', 
                ephemeral: true
            });

            const embed = new EmbedBuilder()
            .setTitle("Discord API Error")
            .setColor("Red")
            .setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
            .setDescription(`\`\`\`${inspect(error, { depth: 0 }).slice(0, 1000)}\`\`\``)
            .setTimestamp();

        await webhook.send({ embeds: [embed] });

        }

    },

};