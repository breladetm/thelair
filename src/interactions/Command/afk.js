const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

const Schema = require("../../database/models/music");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('AFK Commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('View commands in the AFK category.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set yourself as AFK')
                .addStringOption(option => option.setName('reason').setDescription('The reason for your AFK'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('View all AFK members')
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

 