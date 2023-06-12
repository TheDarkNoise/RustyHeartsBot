const { Client, SlashCommandBuilder, PermissionFlagsBits, ModalBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder } = require("discord.js");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Announces a message")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    /**
     * @param {Client} client
     */
 
    async execute (interaction, client) {

        const { } = interaction

        const modal = new ModalBuilder()
            .setCustomId("announce-modal")
            .setTitle("Announcement")

        const messageInput = new TextInputBuilder()
            .setCustomId("message-input")
            .setLabel("Message")
            .setPlaceholder("Enter the announement message")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)

        const Row = new ActionRowBuilder().addComponents(messageInput)

        modal.addComponents(Row)

        await interaction.showModal(modal)

    }
}