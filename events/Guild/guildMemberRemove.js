const { Client, GuildMember, EmbedBuilder } = require("discord.js");
const leaveschema = require('../../database/leaveDB');;
  
  module.exports = {
    name: "guildMemberRemove",
  
    /**
     * @param {GuildMember} member
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(member, client, err) {

        const leavedata = await leaveschema.findOne({ Guild: member.guild.id });
 
        if (!leavedata) return;
        else {
     
            const channelID = leavedata.Channel;
            const channelwelcome = member.guild.channels.cache.get(channelID);
     
            const embedleave = new EmbedBuilder()
            .setColor("DarkBlue")
            .setTitle(`${member.user.username} has left`)
            .setDescription( `> ${member} has left the Server`)
            .addFields(
                {
                    name: "Joined the Server",
                    value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
                    inline: true
                },
                {
                    name: "Account Created",
                    value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`,
                    inline: true
                },
                {
                    name: "Roles",
                    value: `${member.roles.cache.filter(r => r.id !== member.guild.id).map(roles => `<@&${roles.id}>`).join(", ") || "No Roles"}`,
                    inline: false
                }
            )
            .setFooter({ text: `👋 Cast your goobyes`})
            .setTimestamp()
            .setAuthor({ name: `👋 Member Left`})
            .setThumbnail(member.user.avatarURL({ dynamic: true }))
     
            const welmsg = await channelwelcome.send({ embeds: [embedleave]}).catch(err);
            welmsg.react('👋');
        }

    },
  };