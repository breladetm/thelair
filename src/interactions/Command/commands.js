const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

const Schema = require("../../database/models/customCommandAdvanced");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('custom-commands')
        .setDescription('Custom Commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('View commands in the custom commands category.'),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Create a custom command')
                .addStringOption(option => option.setName('command').setDescription('The name of the command').setRequired(true))
                .addStringOption(option => option.setName('text').setDescription('The response of the command').setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete a custom command')
                .addStringOption(option => option.setName('command').setDescription('The name of the command').setRequired(true)),
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

 