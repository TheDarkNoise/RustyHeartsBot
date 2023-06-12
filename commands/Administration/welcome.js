const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const weschema = require('../../database/welcomeDB');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('welcome-channel')
    .setDMPermission(false)
    .setDescription("Configure your server's welcome channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(command =>
        command.setName('set')
        .setDescription('Sets your welcome channel.')
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('Specified channel will be your welcome channel.')
            .setRequired(true)
        )
    )
    .addSubcommand(command =>
        command.setName('remove')
        .setDescription('Removes your welcome channel.')
    ),

    async execute(interaction) {
 
        const sub = interaction.options.getSubcommand();
 
        switch (sub) {
 
        case 'set':
 
        const channel = interaction.options.getChannel('channel');
        const welcomedata = await weschema.findOne({ Guild: interaction.guild.id });
 
        if (welcomedata) return interaction.reply({ content: `You **already** have a welcome channel! (<#${welcomedata.Channel}>) \n> Do **/welcome-channel remove** to undo.`, ephemeral: true})
        else {
 
            await weschema.create({
                Guild: interaction.guild.id,
                Channel: channel.id
            })
 
            const embed = new EmbedBuilder()
            .setColor("DarkRed")
            .setTitle(`> Your welcome channel has \n> been set successfully!`)
            .setAuthor({ name: `⚙️ Welcome Channel Tool`})
            .setFooter({ text: `⚙️ Use /remove-welcome-channel to undo`})
            .setTimestamp()
            .setFields({ name: `• Channel was Set`, value: `> The channel ${channel} has been \n> set as your Welcome Channel.`, inline: false})
            .setThumbnail(interaction.guild.iconURL())
 
            await interaction.reply({ embeds: [embed] });
 
        }
 
        break;
 
        case 'remove':
 
        const weldata = await weschema.findOne({ Guild: interaction.guild.id });
        if (!weldata) return await interaction.reply({ content: `You **do not** have a welcome channel yet. \n> Do **/welcome-channel set** to set up one.`, ephemeral: true})
        else {
 
            await weschema.deleteMany({
                Guild: interaction.guild.id
            })
 
            const embed1 = new EmbedBuilder()
            .setColor("DarkRed")
            .setTitle(`> Your welcome channel has \n> been removed successfully!`)
            .setAuthor({ name: `⚙️ Welcome Channel Tool`})
            .setFooter({ text: `⚙️ Use /set-welcome-channel to set your channel`})
            .setTimestamp()
            .setFields({ name: `• Your Channel was Removed`, value: `> The channel you have previously set \n> as your welcome channel will no longer \n> receive updates.`, inline: false})
            .setThumbnail(interaction.guild.iconURL())
 
            await interaction.reply({ embeds: [embed1] });
        }
        }
    } 
}