const { Client, ModalSubmitInteraction, InteractionType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'interactionCreate',

    /**
     * @param {ModalSubmitInteraction} interaction
     * @param {Client} client 
     */

    async execute(interaction, client) {

        const { type, customId, guild, user, channel, fields } = interaction

        if (type !== InteractionType.ModalSubmit) return
        if (!guild || user.bot) return

        if (customId !== "announce-modal") return

        await interaction.deferReply({ ephemeral: true })

        const messageInput = fields.getTextInputValue("message-input")

        const Embed = new EmbedBuilder()
            .setColor("#c5a0c1")
            .setTitle("New Announcement")
            .setThumbnail(guild.iconURL())
            .setDescription(messageInput)
            .setTimestamp()
            .setFooter({ text: `Announced by ${user.tag}` })

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setDescription(`✅ | Announcement is now live in ${channel}`)
                .setColor("Green")
            ], 
        })

        channel.send({ embeds: [Embed] }).then(async msg => {

            await msg.react("⬆")
            await msg.react("⬇")

        })


    },

};