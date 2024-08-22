const { TextChannel } = require('discord.js');

/**
 * Handles the 'send' subcommand.
 * @param {CommandInteraction} interaction
 * @param {Client} client
 */
module.exports = async (client, interaction, args) => {
    const channelId = interaction.options.getString('channel');
    const content = interaction.options.getString('content');

    try {
        // Fetch the channel
        const channel = await client.channels.fetch(channelId);

        // Ensure it's a text channel
        if (!(channel instanceof TextChannel)) {
            return interaction.reply({ content: 'Invalid channel type.', ephemeral: true });
        }

        // Send the content to the channel
        await channel.send(content);

        // Edit the interaction to confirm the message was sent
        await interaction.editReply({ content: 'I have sent the message.', ephemeral: true });
    } catch (error) {
        console.error('Error sending message:', error);
        await interaction.reply({ content: 'An error occurred while sending the message.', ephemeral: true });
    }
};
