const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
  
  module.exports = {
    cooldown: 7,
    data: new SlashCommandBuilder()
      .setName("clear")
      .setDescription("clear messages")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
      .setDMPermission(false)
      .addStringOption((option) =>
        option
          .setName("amount")
          .setDescription("The number of messages to clear")
          .setRequired(true)
      )
      .addUserOption((option) =>
        option.setName("user")
        .setDescription("Clear messages from a specific user")
      ),
    async execute(interaction) {

      const amount = interaction.options.getString("amount");
      const user = interaction.options.getUser("user");
  
      if (isNaN(amount) || parseInt(amount) < 1) {
        return interaction.reply({ embeds: [
            new EmbedBuilder()
            .setTitle("Error")
            .setDescription(`Please provide a valid number greater than 0`)
            .setColor("Red")
        ], ephemeral: true })
      }

      await interaction.deferReply({ ephemeral: true });
  
      let deletedSize = 0;
  
      if (user) {
        let fetchedMessages;
        let lastMessageId = null;
  
        do {
          fetchedMessages = await interaction.channel.messages.fetch({
            limit: 100, 
            before: lastMessageId, 
          });
  
          const messagesToDelete = fetchedMessages.filter(
            (m) => m.author.id === user.id
          );

          const messagesToDeleteSize = messagesToDelete.size;
  
          if (messagesToDeleteSize > 0) {
            const deletedMessages = await interaction.channel.bulkDelete(
              messagesToDelete,
              true 
            );
            deletedSize += deletedMessages.size;
          }
  
          lastMessageId = fetchedMessages.last()?.id;
        } while (fetchedMessages.size === 100); 
  
      } else {
      
        while (deletedSize < amount) {
          const remainingAmount = amount - deletedSize; 
          const batchSize = remainingAmount > 100 ? 100 : remainingAmount; 
  
          const fetchedMessages = await interaction.channel.messages.fetch({
            limit: batchSize,
          });
          const deletedMessages = await interaction.channel.bulkDelete(
            fetchedMessages,
            true
          );
  
          if (deletedMessages.size > 0) {
            deletedSize += deletedMessages.size;
          } else {
            break;
          }
        }
      }
  
      const deletedUser = user ? user.username : "everyone";
  
      return interaction.editReply({ embeds: [
        new EmbedBuilder()
        .setTitle("♻️ Completed Cleaning")
        .setDescription(`> Total messages successfully deleted **${deletedSize}** sent by ${deletedUser}.`)
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
        .setColor("#c5a0c1")
    ] })
    },
  };