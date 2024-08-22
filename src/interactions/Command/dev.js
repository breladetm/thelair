const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const model = require('../../database/models/badge'); // Adjust path as needed

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dev')
        .setDescription('Developer Commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('View commands in the developer category.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('eval')
                .setDescription('Evaluate a piece of code')
                .addStringOption(option => option.setName('code').setDescription('Your code').setRequired(true))
        )
		.addSubcommand(subcommand =>
            subcommand
                .setName('add-flag')
                .setDescription('Add a permission to a user')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
				.addStringOption(option => option.setName('badge').setDescription('Input a badge').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('reply')
                .setDescription('Reply to a message')
                .addStringOption(option => option.setName('channel').setDescription('Channel ID').setRequired(true))
                .addStringOption(option => option.setName('message').setDescription('Message ID').setRequired(true))
                .addStringOption(option => option.setName('content').setDescription('Message content').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('message')
                .setDescription('Send a message')
                .addStringOption(option => option.setName('channel').setDescription('Channel ID').setRequired(true))
                .addStringOption(option => option.setName('content').setDescription('Message content').setRequired(true))
        )
         .addSubcommand(subcommand =>
            subcommand
                .setName('dm')
                .setDescription('Send a dm')
                .addUserOption(option => option.setName('user').setDescription('User ID').setRequired(true))
                .addStringOption(option => option.setName('content').setDescription('Message content').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ban')
                .setDescription('Manage the blacklist')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('Select an action')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Ban the user', value: 'ban' },
                            { name: 'Unban the user', value: 'unban' }
                        )
                )
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Select a reason')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Continued abuse', value: 'continued_abuse' },
                            { name: 'Banned from The Lair server', value: 'banned_from_server' },
                            { name: 'Discord ToS Violation', value: 'tos_violation' },
                            { name: 'Staff Request', value: 'staff_request' }
                        )
                ))

                .addSubcommand(subcommand =>
                    subcommand
                        .setName('args')
                        .setDescription('Post preset messages')
                        .addStringOption(option =>
                            option.setName('message')
                                .setDescription('Select a message')
                                .setRequired(true)
                                .addChoices(
                                    { name: 'Rules', value: 'rules' },
                                    { name: 'Booster Perks', value: 'boosterperks' },
                                )
                        )
                )
		.addSubcommand(subcommand =>
            subcommand
                .setName('remove-flag')
                .setDescription('Remove a permission from a user')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
				.addStringOption(option => option.setName('badge').setDescription('Input a badge').setRequired(true))
        ),

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        try {
            // Fetch the user's badge data from the database
            const userBadges = await model.findOne({ User: interaction.user.id });

            // Check if the user has the DEVELOPER flag
            if (userBadges && userBadges.FLAGS.includes('DEVELOPER')) {
                await interaction.deferReply({ fetchReply: true });
                client.loadSubcommands(client, interaction, args);
            } else {
                // User does not have the DEVELOPER flag
                return client.errNormal({
                    error: 'Only developers are allowed to do this.',
                    type: 'ephemeral'
                }, interaction);
            }
        } catch (error) {
            console.error('Error fetching badges:', error);
            return client.errNormal({
                error: 'An error occurred while checking permissions.',
                type: 'ephemeral'
            }, interaction);
        }
    },
};
