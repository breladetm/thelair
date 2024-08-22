const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('games')
        .setDescription('Games Commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help') 
                .setDescription('View commands in the games category.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('trivia')
                .setDescription('Test your knowledge with Trivia'),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('fasttype')
                .setDescription('Test your typing speed'),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('8ball')
                .setDescription('Ask The Lair a question')
                .addStringOption(option => option.setName('question').setDescription('Your question').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rps')
                .setDescription('Play RPS against The Lair')
                .addStringOption(option =>
                    option.setName('option')
                        .setDescription('Your choice')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Rock', value: 'rock' },
                            { name: 'Paper', value: 'paper' },
                            { name: 'Scissors', value: 'scissors' }
                        )
                )
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

 