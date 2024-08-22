const Discord = require('discord.js');
const generator = require('generate-password');
const Schema = require("../../database/models/notes");

module.exports = async (client, interaction, args) => {
    const rawboard = await Schema.find({ Guild: interaction.guild.id, User: interaction.user.id });

    if (rawboard.length < 1) {
        return client.errNormal({ error: "You have no entries.", type: 'editreply' }, interaction);
    }

    // Format priority to have the first letter capitalized
    const lb = rawboard.map(e => {
        const formattedPriority = e.Priority.charAt(0).toUpperCase() + e.Priority.slice(1);
        return `**#${e.Code}** \n> Entry: ${e.Note} \n> Priority: ${formattedPriority} \n`;
    });

    await client.createLeaderboard(`To-Do List`, lb, interaction);
};
