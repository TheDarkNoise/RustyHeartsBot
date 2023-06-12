const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
 
module.exports = {
    cooldown: 7,
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ver a latencia do bot"),
 
    async execute (interaction, client) {

        const ping = Math.round(client.ws.ping)
        const gateway = Date.now() - interaction.createdTimestamp
          const msg = await interaction.reply({embeds: [
              new EmbedBuilder()
              .setColor("#9400d3")
              .setDescription(`**I am calculating the ping, please wait**`)
          ]})
          setTimeout(() => {
              interaction.editReply({embeds: [
                  new EmbedBuilder()
                  .setColor("#4D4DFF")
                  .setDescription(`**I am calculating the ping, please wait.**`)
              ]})
          }, 1000)
      
          setTimeout(() => {
              interaction.editReply({embeds: [
                  new EmbedBuilder()
                  .setColor("#ffd700")
                  .setDescription(`**I am calculating the ping, please wait..**`)
              ]})
          }, 2000)
          setTimeout(() => {
              interaction.editReply({embeds: [
                  new EmbedBuilder()
                  .setColor("#000000")
                  .setDescription(`**I am calculating the ping, please wait...**`)
              ]})
          }, 3000)
          setTimeout(() => {
            interaction.editReply({embeds: [
              new EmbedBuilder()
                .setColor("#9400d3")
                .setDescription(`**I am calculating the ping, please wait.**`)
            ]})
        }, 4000)
        setTimeout(() => {
          interaction.editReply({embeds: [
              new EmbedBuilder()
              .setColor("#ffd700")
              .setDescription(`**I am calculating the ping, please wait..**`)
          ]})
      }, 5000)
      setTimeout(() => {
        interaction.editReply({embeds: [
          new EmbedBuilder()
            .setColor("#000000")
            .setDescription(`**I am calculating the ping, please wait...**`)
        ]})
    }, 6000)
          setTimeout(() => {
              interaction.editReply({embeds: [
                  new EmbedBuilder()
                  .setColor("#ffa0fa")
                  .setDescription(`*📌 | Ping (latency): \`${ping}\` ms\n\n⏰ | Gateway Ping: \`${gateway}\` ms*`)
              ]})
          }, 8000)

    }
}