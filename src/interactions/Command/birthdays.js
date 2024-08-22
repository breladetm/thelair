const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('birthdays')
        .setDescription('Birthday Commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('View commands in the birthday category.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('check')
                .setDescription('View your birthday')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete your birthday')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('View all birthdays')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set your birthday')
                .addNumberOption(option => option.setName('day').setDescription('Day of birth').setRequired(true))
                .addNumberOption(option => option.setName('month').setDescription('Month of birth').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('set-user')
                .setDescription('Set a users birthday')
                .addUserOption(option => option.setName('user').setDescription('User to set birthday for').setRequired(true))
                .addNumberOption(option => option.setName('day').setDescription('Day of birth').setRequired(true))
                .addNumberOption(option => option.setName('month').setDescription('Month of birth').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete-user')
                .setDescription('Delete a users birthday')
                .addUserOption(option => option.setName('user').setDescription('User to delete birthday for').setRequired(true))
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

 