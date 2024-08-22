const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('User Commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('View commands in the user category.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('View user information')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(false)) // Make this option optional
        )
		.addSubcommand(subcommand =>
            subcommand
                .setName('avatar')
                .setDescription('View a user\'s avatar')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(false)) // Make this option optional
                .addStringOption(option =>
                    option.setName('server')
                        .setDescription('Server avatar')
                        .setRequired(false)
                        .addChoices(
                            { name: 'True', value: 'true' }
                        )
                )
        )
		.addSubcommand(subcommand =>
            subcommand
                .setName('banner')
                .setDescription('View a user\'s banner')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(false)) // Make this option optional
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('flags')
                .setDescription('View a user\'s flags')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(false)) // Make this option optional
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ship')
                .setDescription('Check your compatibility')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
                .addUserOption(option => option.setName('user2').setDescription('Select a second user').setRequired(false)) // Optional user2
        ),

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        await interaction.deferReply({ fetchReply: true });
        client.loadSubcommands(client, interaction, args);
    },
};
