const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const leschema = require('../../database/leaveDB');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('leave-channel')
    .setDMPermission(false)
    .setDescription("Configure o canal de saídas do seu servidor.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(command =>
        command.setName('set')
        .setDescription('Define seu canal de saídas.')
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('O canal especificado será seu canal de saídas.')
            .setRequired(true)
        )
    )
    .addSubcommand(command =>
        command.setName('remove')
        .setDescription('Remove seu canal de saídas.')
    ),

    async execute(interaction) {
 
        const sub = interaction.options.getSubcommand();
 
        switch (sub) {
 
        case 'set':
 
        const channel = interaction.options.getChannel('channel');
        const leavedata = await leschema.findOne({ Guild: interaction.guild.id });
 
        if (leavedata) return interaction.reply({ content: `You **already** have a leave channel! (<#${leavedata.Channel}>) \n> Do **/leave-channel remove** to undo.`, ephemeral: true})
        else {
 
            await leschema.create({
                Guild: interaction.guild.id,
                Channel: channel.id
            })
 
            const embed = new EmbedBuilder()
            .setColor("DarkRed")
            .setTitle(`> Your leave channel has \n> been set successfully!`)
            .setAuthor({ name: `⚙️ Leave Channel Tool`})
            .setFooter({ text: `⚙️ Use /leave-channel remove to undo`})
            .setTimestamp()
            .setFields({ name: `• Channel was Set`, value: `> The channel ${channel} has been \n> set as your Leave Channel.`, inline: false})
            .setThumbnail(interaction.guild.iconURL())
 
            await interaction.reply({ embeds: [embed] });
 
        }
 
        break;
 
        case 'remove':
 
        const weldata = await leschema.findOne({ Guild: interaction.guild.id });
        if (!weldata) return await interaction.reply({ content: `You **do not** have a leave channel yet. \n> Do **/leave-channel set** to set up one.`, ephemeral: true})
        else {
 
            await leschema.deleteMany({
                Guild: interaction.guild.id
            })
 
            const embed1 = new EmbedBuilder()
            .setColor("DarkRed")
            .setTitle(`> Your leave channel has \n> been removed successfully!`)
            .setAuthor({ name: `⚙️ Leave Channel Tool`})
            .setFooter({ text: `⚙️ Use /leave-channel set to set your channel`})
            .setTimestamp()
            .setFields({ name: `• Your Channel was Removed`, value: `> The channel you have previously set \n> as your leave channel will no longer \n> receive updates.`, inline: false})
            .setThumbnail(interaction.guild.iconURL())
 
            await interaction.reply({ embeds: [embed1] });
        }
        }
    } 
}