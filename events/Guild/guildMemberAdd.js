const { Client, GuildMember, EmbedBuilder } = require("discord.js");
const welcomeschema = require('../../database/welcomeDB');
const roleschema = require('../../database/autorole');
  
  module.exports = {
    name: "guildMemberAdd",
  
    /**
     * @param {GuildMember} member
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(member, client, err) {

        const welcomedata = await welcomeschema.findOne({ Guild: member.guild.id });
 
        if (!welcomedata) return;
        else {
     
            const channelID = welcomedata.Channel;
            const channelwelcome = member.guild.channels.cache.get(channelID)
            const roledata = await roleschema.findOne({ Guild: member.guild.id });
     
            if (roledata) {
                const giverole = await member.guild.roles.cache.get(roledata.Role)
     
                member.roles.add(giverole).catch(err => {
                    console.log('Error received trying to give an auto role!');
                })
            }
     
            const embedwelcome = new EmbedBuilder()
             .setColor("DarkBlue")
             .setTitle(`Welcome to ${member.guild.name}`)
             .setDescription( `> ${member} You are the new member of the server, welcome to **${member.guild.name}!**\n > You are the member  ${member.guild.memberCount} of the server!!`)
             .addFields(
                {
                    name: "Tutorial:",
                    value: "<#1116711484421050379>",
                    inline: true
                },
                {
                    name: "Download:",
                    value: "<#1117224469174427669>",
                    inline: true
                }
             )
             .setFooter({ text: `👋 Get cozy and enjoy :)`})
             .setTimestamp()
             .setAuthor({ name: `👋 Welcome to the Server!`})
             .setThumbnail(member.user.avatarURL({ dynamic: true }))
     
            const embedwelcomedm = new EmbedBuilder()
             .setColor("DarkBlue")
             .setTitle('Welcome Message')
             .setDescription( `> Welcome to ${member.guild.name}!`)
             .setFooter({ text: `👋 Get cozy and enjoy :`})
             .setTimestamp()
             .setAuthor({ name: `👋 Welcome to the Server!`})
             .setThumbnail(member.user.avatarURL({ dynamic: true }))
     
            const levmsg = await channelwelcome.send({ embeds: [embedwelcome]});
            levmsg.react('👋');
            member.send({ embeds: [embedwelcomedm]}).catch(err => console.log(`Welcome DM error: ${err}`))
     
        } 

    },
  };