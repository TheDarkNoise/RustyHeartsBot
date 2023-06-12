const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Storelog = require("../../database/RGLegendDB");
const sql = require('mssql')
 
module.exports = {
    cooldown: 7,
    data: new SlashCommandBuilder()
    .setName("give-zen")
    .setDescription("Give Zen")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
        option.setName('username')
        .setDescription('username')
        .setRequired(true)
    )
    .addNumberOption(option =>
        option.setName('amount')
        .setDescription('amount')
        .setRequired(true)
    ),
 
    async execute (interaction, client) {

        const { options, user, guild } = interaction

        const username = options.getString('username');
        const amount = options.getNumber('amount');

        const storelog = await Storelog.findOne({ guildId: guild.id });

        const transaction = new sql.Transaction(/* [pool] */)
        transaction.begin(err => {
        
            const request = new sql.Request(transaction)
            request.query(`UPDATE [dbo].[CashTable] SET [Zen] = ${amount} WHERE [WindyCode] = '${username}'`, (err, result) => {
        
                transaction.commit(err => {
                    interaction.reply({ 
                        embeds: [
                          new EmbedBuilder()
                          .setAuthor({name: guild.name, iconURL: guild.iconURL()})
                          .setDescription(`✅ | Thank you for purchasing **ZEN** at RH Legend`)
                          .setColor("Green")
                          .addFields(
                            {
                                name: "**Zen Updated**",
                                value: `${amount}`,
                                inline: true
                            },
                            {
                                name: "**Player**",
                                value: `${username}`,
                                inline: true
                            },
                          )
                          .setThumbnail(guild.iconURL())
                          .setFooter({ text: `${guild.name} ©2023`, iconURL: guild.iconURL() })
                          .setTimestamp()
                      ], ephemeral: false
                       });
                })
            })
        })

        if (!storelog || !storelog.logStoreChannelId) {
            return;
        }

            const channel = interaction.guild.channels.cache.get(storelog.logStoreChannelId);
    
            if (channel) {
              channel.send({
                embeds: [
                  new EmbedBuilder()
                    .setColor("Red")
                    .setThumbnail(guild.iconURL())
                    .setTitle(`A sale was made, see who made the sale`)
                    .addFields(
                      { name: "Buyer (Player)", value: `${username}`, inline: true },
                      { name: "Amount of Zen Sold", value: `${amount}`, inline: true },
                      { name: "Seller:", value: `${user.tag}`, inline: true },
                      { name: "Sold in:", value: new Date().toLocaleString(), inline: true },
                  )
                ],
              });
            }
                

    }
}