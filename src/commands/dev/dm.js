const { CommandInteraction, Client } = require('discord.js');

/**
 * Handles the 'send' subcommand.
 * @param {CommandInteraction} interaction
 * @param {Client} client
 */
module.exports = async (client, interaction, args) => {
    // Fetch the user directly from the interaction options
    const user = interaction.options.getUser('user');
    const content = interaction.options.getString('content');

    // Check if the user is valid
    if (!user) {
        return interaction.reply({ content: 'Invalid user provided.', ephemeral: true });
    }

    try {
        // Send a DM to the user
        await user.send(content);

        // Edit the interaction to confirm the message was sent
        await interaction.editReply({ 
            content: `I have messaged ${user.username} (\`${user.id}\`).`, 
            ephemeral: true 
        });
    } catch (error) {
        console.error('Error sending DM:', error);
        await interaction.reply({ content: 'An error occurred while sending the DM.', ephemeral: true });
    }
};
