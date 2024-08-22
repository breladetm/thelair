const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup Commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('View commands in the setup category.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('invites')
                .setDescription('Setup the the server logs')
                .addStringOption(option =>
                    option.setName('setup')
                        .setDescription('The setup that you want')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Invites Channel', value: 'welcomechannel' },
                            { name: 'Leave Channel', value: 'leavechannel' }
                        )
                )
                .addChannelOption(option => option.setName('channel').setDescription('The channel that you want').setRequired(true).addChannelTypes(ChannelType.GuildText))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('games')
                .setDescription('Setup certain games')
                .addStringOption(option =>
                    option.setName('setup')
                        .setDescription('Select the setup')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Guess The Word', value: 'gtw' }
                        )
                )
                .addChannelOption(option => option.setName('channel').setDescription('The channel for the game').setRequired(true).addChannelTypes(ChannelType.GuildText))
        )
		        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Remove a setup')
                .addStringOption(option =>
                    option.setName('setup')
                        .setDescription('The setup that you want')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Guess The Word', value: 'gtw' },
                            { name: 'Invites Channel', value: 'welcomechannel' },
                            { name: 'Leave Channel', value: 'leavechannel' },
                        )
                )
        )
    ,


    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        await interaction.deferReply({ fetchReply: true });
        const perms = await client.checkUserPerms({
            flags: [Discord.PermissionsBitField.Flags.Administrator],
            perms: [Discord.PermissionsBitField.Flags.Administrator]
        }, interaction)

        if (perms == false) return;
        
        client.loadSubcommands(client, interaction, args);
    },
};


 