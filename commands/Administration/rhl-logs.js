const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const Storelog = require("../../database/RGLegendDB");


module.exports = {
    data: new SlashCommandBuilder()
    .setName('rhl-logs')
    .setDescription('Configure Rusty Hearts server logs')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
        subcommand.setName('store')
        .setDescription('Define the channel where the logs are sent.')
        .addChannelOption(option =>
          option.setName('channel')
          .setDescription('Define the channel where the logs go.')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      )
    )
    .addSubcommand(subcommand =>
        subcommand.setName('delete')
        .setDescription('Delete system logs')
    ),

    async execute (interaction, client) {

        const sub = interaction.options.getSubcommand();
  
        switch (sub) {
          case "store":
            {
              if (interaction.options.getSubcommand() === "store") {

                const guildId = interaction.guild.id;
                const logStoreChannelId = interaction.options.getChannel('channel').id;
       
                try {
                    let storelog = await Storelog.findOne({ guildId });
                    if (storelog) {
                        return interaction.reply({ content: 'A RHL Logs channel has already been set up for this server.', ephemeral: true });
                    }
       
                    storelog = await Storelog.findOneAndUpdate(
                        { guildId },
                        { logStoreChannelId },
                        { upsert: true }
                    );
       
                    return interaction.reply(`RHL Logs channel set to <#${logStoreChannelId}>`);
                } catch (error) {
                    console.error(error);
                    return interaction.reply('An error occurred while setting up the RHL Logs channel');
                }

              }
            }
            break;
          case "delete":
            {
              if (interaction.options.getSubcommand() === "delete") {

                const guildId = interaction.guild.id;
     
                try {
                    const storelog = await Storelog.findOne({ guildId });
                    if (!storelog) {
                        return interaction.reply({ content: 'RHL Logs channel has not been set up yet.', ephemeral: true });
                    }
     
                    await Storelog.findOneAndDelete({ guildId });
     
                    return interaction.reply(`RHL Logs channel disabled.`);
                } catch (error) {
                    console.error(error);
                    return interaction.reply('An error occurred while disabling the RHL Logs channel');
                }

              }
            }
            break;
        }

    }
}