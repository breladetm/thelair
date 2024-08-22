const { PermissionsBitField } = require('discord.js');
const Schema = require("../../database/models/birthday");
const BadgeModel = require('../../database/models/badge'); // Badge model

module.exports = async (client, interaction, args) => {
    try {
        // Check if the user has the ADMINISTRATOR permission
        const hasAdminPermission = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);

        // Fetch the user's badge data from the database
        const userBadges = await BadgeModel.findOne({ User: interaction.user.id });
        const isDeveloper = userBadges && userBadges.FLAGS.includes('DEVELOPER');

        // If the user has neither ADMINISTRATOR permission nor DEVELOPER badge, deny access
        if (!hasAdminPermission && !isDeveloper) {
            return interaction.editReply({
                content: 'You do not have permission to use this command.',
            });
        }

        const targetUser = interaction.options.getUser('user'); // Get the specified user from the interaction
        if (!targetUser) {
            return client.errNormal({
                error: "You must specify a user whose birthday you want to delete.",
                type: 'editreply'
            }, interaction);
        }

        // Find the birthday entry for the specified user
        const data = await Schema.findOne({ Guild: interaction.guild.id, Username: targetUser.username });
        if (!data) {
            return client.errNormal({
                error: `No birthday found for user \`${targetUser.username}\`.`,
                type: 'editreply'
            }, interaction);
        }

        // Delete the birthday entry for the specified user
        await Schema.findOneAndDelete({ Guild: interaction.guild.id, Username: targetUser.username });
        client.succNormal({
            text: `I have deleted the birthday for \`${targetUser.username}\`.`,
            type: 'editreply'
        }, interaction);

    } catch (error) {
        console.error(error);
        client.errNormal({
            error: "An error occurred while deleting the birthday.",
            type: 'editreply'
        }, interaction);
    }
};
