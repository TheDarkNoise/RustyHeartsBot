const { Client, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
 
module.exports = {
    cooldown: 7,
    data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get information about a user")
    .addUserOption(option =>
        option.setName('member')
        .setDescription('Get information about a single member.')
        .setRequired(false)
    ),

    /**
     * @param {Client} client
     */
 
    async execute (interaction, client) {

        const target = interaction.options.getMember("member") || interaction.member;

        const { user, presence, roles } = target;
        const formatter = new Intl.ListFormat("en-GB", { style: "narrow", type: "conjunction" });
        
        await user.fetch();

        const statusType = {
            idle: "1FJj7pX.png",
            dnd: "fbLqSYv.png",
            online: "JhW7v9d.png",
            invisible: "dibKqth.png"
        };

        const activityType = [
            "🕹 *Playing*",
            "🎙 *Streaming*",
            "🎧 *Listening to*",
            "📺 *Watching*",
            "🤹🏻‍♀️ *Custom*",
            "🏆 *Competing in*"
        ];

        const clientType = [
            { name: "desktop", text: "Computer", emoji: "💻" },
            { name: "mobile", text: "Phone", emoji: "🤳🏻" },
            { name: "web", text: "Website", emoji: "🌍" },
            { name: "offline", text: "Offline", emoji: "💤" }
        ];

        const badges = {
            BugHunterLevel1: "<:BugHunter:1117172289432203315>",
            BugHunterLevel2: "<:BugBuster:1117172586057568426>",
            CertifiedModerator: "<:DiscordCertifiedModerator:1117172707683995729>",
            HypeSquadOnlineHouse1: "<:HypesquadBravery:1117172799182741564>",
            HypeSquadOnlineHouse2: "<:HypesquadBrilliance:1117172885954498600>",
            HypeSquadOnlineHouse3: "<:HypesquadBalance:1117172984575180820>",
            Hypesquad: "<:HypeSquadEventAttendee:1117173086677127221>",
            Partner: "<a:DiscordPartner:1117189995757850634>",
            PremiumEarlySupporter: "<:EarlySupporter:1117190148254335117>",
            Staff: "<:DiscordStaff:1117190228822724638>",
            VerifiedBot: "<:VerifiedBot:1117190315804201011>",
            VerifiedDeveloper: "<:VerifiedDeveloper:1117190408229900318>",
            ActiveDeveloper: "<:ActiveDeveloper:1117190508670877769>",
            LegacyUsernameBadge: "<:LegacyUsernameBadge:1117549013328220170>"
        };

        const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
            let totalLength = 0;
            const result = [];

            for (const role of roles) {
                const roleString = `<@&${role.id}>`;

                if (roleString.length + totalLength > maxFieldLength)
                    break;

                totalLength += roleString.length + 1; // +1 as it's likely we want to display them with a space between each role, which counts towards the limit.
                result.push(roleString);
            }

            return result.length;
        }

        const sortedRoles  = roles.cache.map(role => role).sort((a, b) => b.position - a.position).slice(0, roles.cache.size - 1);

        const clientStatus = presence?.clientStatus instanceof Object ? Object.keys(presence.clientStatus) : "offline";
        const userFlags    = user.flags.toArray();

        const deviceFilter = clientType.filter(device => clientStatus.includes(device.name));
        const devices      = !Array.isArray(deviceFilter) ? new Array(deviceFilter) : deviceFilter;

        interaction.reply({ embeds: [
            new EmbedBuilder()
                .setColor("c5a0c1")
                .setAuthor({
                    name: user.tag,
                    iconURL: `https://i.imgur.com/${statusType[presence?.status || "invisible"]}`
                })
                .setThumbnail(user.avatarURL({ size: 1024 }))
                .setImage(user.bannerURL({ size: 1024 }))
                .addFields(
                    { name: "ID", value: `💳 ${user.id}` },
                    { name: "Activities", value: presence?.activities.map(activity => `${activityType[activity.type]} ${activity.name}`).join("\n") || "None" },
                    { name: "Joined Server", value: `🤝🏻 <t:${parseInt(target.joinedTimestamp / 1000)}:R>`, inline: true },
                    { name: "Account Created", value: `📆 <t:${parseInt(user.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: "Nickname", value: `🦸🏻‍♀️ ${target.nickname || "None"}`, inline: true },
                    {
                        name: `Roles (${maxDisplayRoles(sortedRoles)} of ${sortedRoles.length})`, 
                        value: `${sortedRoles.slice(0, maxDisplayRoles(sortedRoles)).join(" ") || "None"}`
                    },
                    { name: `Badges (${userFlags.length})`, value: userFlags.length ? formatter.format(userFlags.map(flag => `**${badges[flag]}**`)) : "None" },
                    { name: "Devices", value: devices.map(device => `${device.emoji} ${device.text}`).join("\n"), inline: true },
                    { name: "Profile Colour", value: `🎨 ${user.hexAccentColor || "None"}`, inline: true },
                    { name: "Boosting Server", value: `🏋🏻‍♀️ ${roles.premiumSubscriberRole ? `Since <t:${parseInt(target.premiumSinceTimestamp / 1000)}:R>` : "No"}`, inline: true },
                    { name: "Banner", value: user.bannerURL() ? "** **" : "🎏 None" }
                )
        ], ephemeral: true });

    }
}