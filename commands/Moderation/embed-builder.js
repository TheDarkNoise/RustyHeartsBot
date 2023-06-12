const { SlashCommandBuilder, EmbedBuilder, TextInputBuilder, ModalBuilder, ActionRowBuilder, TextInputStyle, PermissionFlagsBits } = require("discord.js")

module.exports = {
    cooldown: 7,
    data: new SlashCommandBuilder()
        .setName("embed-builder")
        .setDescription("Submit a custom embed")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {

        let Modal = new ModalBuilder()
            .setCustomId('report')
            .setTitle('Create your embed')

        let question1 = new TextInputBuilder()
            .setCustomId('title')
            .setLabel('What title do you want to put?')
            .setRequired(false)
            .setPlaceholder('Write here... (optional)')
            .setStyle(TextInputStyle.Short)

        let question2 = new TextInputBuilder()
            .setCustomId('description')
            .setLabel("What description do you want to put?")
            .setRequired(true)
            .setPlaceholder('Write here...')
            .setStyle(TextInputStyle.Paragraph)

        let question3 = new TextInputBuilder()
            .setCustomId('color')
            .setLabel('What color do you want to put?')
            .setRequired(false)
            .setPlaceholder('In this format: #3dffcc (optional)')
            .setStyle(TextInputStyle.Short)

        let question4 = new TextInputBuilder()
            .setCustomId('footer')
            .setLabel('What do you want to put in Footer?')
            .setRequired(false)
            .setPlaceholder('Write here... (optional)')
            .setStyle(TextInputStyle.Short)

        let question5 = new TextInputBuilder()
            .setCustomId('timestamp')
            .setLabel('Do you want to put the timestamp?')
            .setRequired(false)
            .setPlaceholder('Yes/No (optional)')
            .setStyle(TextInputStyle.Short)

        let ActionRow1 = new ActionRowBuilder().addComponents(question1);
        let ActionRow2 = new ActionRowBuilder().addComponents(question2);
        let ActionRow3 = new ActionRowBuilder().addComponents(question3);
        let ActionRow4 = new ActionRowBuilder().addComponents(question4);
        let ActionRow5 = new ActionRowBuilder().addComponents(question5);

        Modal.addComponents(ActionRow1, ActionRow2, ActionRow3, ActionRow4, ActionRow5)

        await interaction.showModal(Modal)

        try {

            let reponse = await interaction.awaitModalSubmit({ time: 300000 })

            let title = reponse.fields.getTextInputValue('title')
            let description = reponse.fields.getTextInputValue('description')
            let color = reponse.fields.getTextInputValue('color')
            let footer = reponse.fields.getTextInputValue('footer')
            let timestamp = reponse.fields.getTextInputValue('timestamp')

            const Embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`:grey_exclamation: **Your embed was sent successfully!**`)

            if (!color) color = "Red"
            if (!footer) footer = ' '
            if (!title) title = ' '
            if (!description) description = ' '

            let Embed1 = new EmbedBuilder()
                .setColor(`${color}`)
                .setTitle(`${title}`)
                .setDescription(`${description}`)
                .setFooter({ text: `${footer}` })

            if (reponse.fields.getTextInputValue('timestamp') === 'Yes') Embed1.setTimestamp()
            if (!reponse.fields.getTextInputValue('timestamp') === 'Yes') return;

            await interaction.channel.send({ embeds: [Embed1] })

            await reponse.reply({ embeds: [Embed], ephemeral: true })


        } catch (err) { return; }
    }
}