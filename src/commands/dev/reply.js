const { TextChannel } = require('discord.js');

/**
 * Handles the 'reply' subcommand.
 * @param {CommandInteraction} interaction
 * @param {Client} client
 */
module.exports = async (client, interaction, args) => {
    const messageId = interaction.options.getString('message');
    const channelId = interaction.options.getString('channel');
    const content = interaction.options.getString('content');

    try {
        // Fetch the channel
        const channel = await client.channels.fetch(channelId);

        // Ensure it's a text channel
        if (!(channel instanceof TextChannel)) {
            return interaction.reply({ content: 'Invalid channel type.', ephemeral: true });
        }

        // Fetch the message to reply to
        const message = await channel.messages.fetch(messageId);

        // Reply to the message
        await message.reply(content);

        // Edit the interaction to confirm the reply was sent
        await interaction.editReply({ content: 'I have sent the reply.', ephemeral: true });
    } catch (error) {
        console.error('Error replying to message:', error);
        await interaction.reply({ content: 'An error occurred while replying to the message.', ephemeral: true });
    }
};
