const { Client, SlashCommandBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ChannelType } = require("discord.js");
 
module.exports = {
    cooldown: 7,
    data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Says something through the bot")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addChannelOption(option =>
        option.setName('channel')
        .setDescription('The channel you want to send the message to')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ),

    /**
     * @param {Client} client
     */
 
    async execute (interaction, client) {

        let channel = interaction.options.getChannel("channel");

        if (!channel) {
            channel = interaction.channel;
        }

        let saymodal = new ModalBuilder()
            .setCustomId("say")
            .setTitle("Say something for the bot")
        
        let sayquestion = new TextInputBuilder()
            .setCustomId("say")
            .setLabel("Write something")
            .setPlaceholder("Write something...")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
        
        let sayembed = new TextInputBuilder()
            .setCustomId('embed')
            .setLabel("Embed mode on/off?")
            .setPlaceholder("on/off")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
        


        let say = new ActionRowBuilder().addComponents(sayquestion);
        let sayemb = new ActionRowBuilder().addComponents(sayembed);

        saymodal.addComponents(say, sayemb)

        await interaction.showModal(saymodal)

        
        try {
            let response = await interaction.awaitModalSubmit({time: 300000})
            let message = response.fields.getTextInputValue('say')
            let embedsay = response.fields.getTextInputValue('embed')

            const embed = new EmbedBuilder()
                .setDescription(message)
                .setColor('Blue')

            
            if (embedsay === "on" || embedsay === "On") {
                await channel.send({embeds: [embed]})
            } else {
                await channel.send(message)
            }

            await response.reply({content: "Your message has been sent successfully", ephemeral: true})
       } catch (error) {
            console.error(error)
            return;
        }

    }
}