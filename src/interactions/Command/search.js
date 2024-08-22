const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search something on the internet')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Get information about the search category commands')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('bing')
                .setDescription('Find something on Bing')
                .addStringOption(option => option.setName('name').setDescription('Your search').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ddg')
                .setDescription('Find something on DuckDuckGo')
                .addStringOption(option => option.setName('name').setDescription('Your search').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('google')
                .setDescription('Find something on Google')
                .addStringOption(option => option.setName('name').setDescription('Your search').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('youtube')
                .setDescription('Find something on YouTube')
                .addStringOption(option => option.setName('name').setDescription('Your search').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('docs')
                .setDescription('See the discord.js docs')
                .addStringOption(option => option.setName('name').setDescription('Your search').setRequired(true))
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName('spotify')
                .setDescription('Search Spotify for any song')
                .addStringOption(option => option.setName('song').setDescription('Enter a song name').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('translate')
                .setDescription('Translate something')
                .addStringOption(option => option.setName('language').setDescription('Enter a 2 digit language code').setRequired(true))
                .addStringOption(option => option.setName('text').setDescription('Enter your text').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('weather')
                .setDescription('View the current weather')
                .addStringOption(option => option.setName('location').setDescription('Enter a location').setRequired(true))
        )
    ,

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

 