const { CommandInteraction, Client } = require('discord.js');
const { ContextMenuCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const axios = require("axios");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Userinfo')
        .setType(2),

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: false });
        const member = await interaction.guild.members.fetch(interaction.options.getUser('user').id);
        if (!member) return client.errNormal({
            error: "This user is not in this guild!",
            type: 'editreply'
        }, interaction);

        const roles = member.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1); // Remove @everyone role

        return client.embed({
            title: `User Information`,
            thumbnail: member.user.displayAvatarURL({ dynamic: true, size: 1024 }),
            image: member.user.bannerURL({ dynamic: true, size: 1024 }),
            fields: [
                {
                    name: "Username",
                    value: `${member.user.username}`,
                    inline: false,
                },
                {
                    name: "Nickname",
                    value: `${member.nickname || 'No nickname'}`,
                    inline: false,
                },
                {
                    name: "ID",
                    value: `${member.user.id}`,
                    inline: false,
                },
                {
                    name: "Account Creation",
                    value: `<t:${Math.round(member.user.createdTimestamp / 1000)}>`,
                    inline: false,
                },
                {
                    name: "Joined Server",
                    value: `<t:${Math.round(member.joinedAt / 1000)}>`,
                    inline: false,
                },
                {
                    name: `Roles [${roles.length}]`,
                    value: `${roles.length ? roles.join(', ') : 'None'}`,
                    inline: false,
                }
            ],
            type: 'editreply'
        }, interaction);
    },
};
