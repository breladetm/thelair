const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fun')
        .setDescription('Fun Commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('View commands in the fun category.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('roast')
                .setDescription('Roast a user')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('hack')
                .setDescription('"Hack" someone')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('kill')
                .setDescription('Kill someone')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ascii')
                .setDescription('Convert text to ASCII')
                .addStringOption(option => option.setName('text').setDescription('Enter text').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('gif')
                .setDescription('Search for a gif')
                .addStringOption(option => option.setName('text').setDescription('Enter search term').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('reverse')
                .setDescription('Reverse the text')
                .addStringOption(option => option.setName('text').setDescription('Enter text').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('birdfact')
                .setDescription('Get a random bird fact')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('catfact')
                .setDescription('Get a random cat fact')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('dogfact')
                .setDescription('Get a random dog fact')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('fact')
                .setDescription('Get a random fact')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('koalafact')
                .setDescription('Get a random koala fact')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('pandafact')
                .setDescription('Get a random panda fact')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('worldclock')
                .setDescription('Show the world clock')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('xmas')
                .setDescription('See the number of days until Christmas')
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
