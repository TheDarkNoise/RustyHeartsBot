const { Client, SlashCommandBuilder, EmbedBuilder, ChannelType, UserFlags, version } = require("discord.js");
const { connection } = require("mongoose");
const os = require("os");
 
module.exports = {
    cooldown: 7,
    data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Displays bot and database status"),

    /**
     * @param {Client} client
     */
 
    async execute (interaction, client) {

        const formatter = new Intl.ListFormat("en-GB", { style: "long", type: "conjunction" });

        const status = [
            "Disconnected",
            "Connected",
            "Connecting",
            "Disconnecting"
        ];

        await client.user.fetch();
        await client.application.fetch();
        
        const getChannelTypeSize = type => client.channels.cache.filter(channel => type.includes(channel.type)).size;
        
        interaction.reply({ embeds: [
            new EmbedBuilder()
                .setColor("c5a0c1")
                .setTitle(`${client.user.username}'s Status`)
                .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
                .addFields(
                    { name: "Description", value: `📝 ${client.application.description || "None"}` },
                    {
                        name: "General",
                        value: [
                            `👩🏻‍🔧 **Bot Name** ${client.user.tag}`,
                            `💳 **ID** ${client.user.id}`,
                            `📆 **Account Created** <t:${parseInt(client.user.createdTimestamp / 1000)}:R>`,
                            `👑 **Owner** ${client.application.owner ? `<@${client.application.owner.id}> (${client.application.owner.tag})` : "None"}`,
                            `<:Discord_Verify:1117166780469751960> **Verified** ${client.user.flags & UserFlags.VerifiedBot ? "Yes" : "No"}`,
                            `🏷 **Tags** ${client.application.tags.length ? formatter.format(client.application.tags.map(tag => `*${tag}*`)) : "None"}`,
                            `<:slashsupported:1117167070942073013> **Commands** ${client.commands.size}`
                        ].join("\n")
                    },
                    {
                        name: "System",
                        value: [
                            `🖥 **Operational system** ${os.type().replace("Windows_NT", "Windows").replace("Darwin", "macOS")}`,
                            `⏰ **Up Since** <t:${parseInt(client.readyTimestamp / 1000)}:R>`,
                            `🏓 **Ping** ${client.ws.ping}ms`,
                            `🧠 **CPU Model** ${os.cpus()[0].model}`,
                            `💾 **CPU Utilization** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}%`,
                            `📚 **Database** ${status[connection.readyState]}`,
                            `👩🏻‍🔧 **Node.js** ${process.version}`,
                            `🛠 **Discord.js** ${version}`
                        ].join("\n"),
                        inline: true
                    },
                    {
                        // Using the caches for some of these isn't always reliable, but it would be a waste of resources to loop through all servers every single time someone used this command.
                        name: "Statistics",
                        value: [
                            `🌍 **Servers** ${client.guilds.cache.size}`,
                            `👨‍👩‍👧‍👦 **Users** ${client.users.cache.size}`,
                            `😏 **Emojis** ${client.emojis.cache.size}`,
                            `💬 **Text Channels** ${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildAnnouncement])}`,
                            `🎙 **Voice Channels** ${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}`,
                            `🧵 **Topics** ${getChannelTypeSize([ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.AnnouncementThread])}`
                        ].join("\n"),
                        inline: true
                    }
                )
        ], ephemeral: true });

    }
}