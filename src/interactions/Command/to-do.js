const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const model = require('../../database/models/badge'); // Adjust path as needed

module.exports = {
    data: new SlashCommandBuilder()
        .setName('to-do')
        .setDescription('View, add or delete entries to the developer to-do list.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('View commands in the to-do category.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add an entry to your to-do list')
                .addStringOption(option => option.setName('entry').setDescription('Your entry').setRequired(true))
                .addStringOption(option =>
                    option.setName('priority')
                        .setDescription('Select a priority')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Major', value: 'major' },
                            { name: 'High', value: 'high' },
                            { name: 'Medium', value: 'medium' },
                            { name: 'Low', value: 'low' }
                        )
                    ))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete an entry from your to-do list')
                .addStringOption(option => option.setName('id').setDescription('Entry ID').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('View the to-do list')
        )
    ,

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


 