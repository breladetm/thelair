const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tools')
        .setDescription('Use some cool tools')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Get information about the tools category commands')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('decode')
                .setDescription('Decode binary code to text')
                .addStringOption(option => option.setName('code').setDescription('Enter code to decode to text').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('emojify')
                .setDescription('Convert text to emojis')
                .addStringOption(option => option.setName('text').setDescription('Input text to convert').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('encode')
                .setDescription('Encode text to binary code')
                .addStringOption(option => option.setName('text').setDescription('Enter text to encode to binary').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('enlarge')
                .setDescription('Enlarge an emoji')
                .addStringOption(option => option.setName('emoji').setDescription('Input an emoji').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('mcskin')
                .setDescription('See the skin of a minecraft user')
                .addStringOption(option => option.setName('name').setDescription('Input a username').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('mcstatus')
                .setDescription('See the status of a minecraft server')
                .addStringOption(option => option.setName('ip').setDescription('Input a server IP').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('pwdgen')
                .setDescription('Generate a password')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('sourcebin')
                .setDescription('Upload code to sourcebin')
                .addStringOption(option => option.setName('language').setDescription('The language of your code').setRequired(true))
                .addStringOption(option => option.setName('code').setDescription('Your code').setRequired(true))
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

 