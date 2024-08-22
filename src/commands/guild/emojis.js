const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = async (client, interaction) => {
  let emojis = [];
  let emojisAnimated = [];
  const emojisPerPage = 25; // Limit for the number of emojis to show
  let currentPage = 0;

  // Function to get the emoji string representation
  function getEmoji(id) {
    return client.emojis.cache.get(id).toString();
  }

  // Classify emojis into animated and standard
  interaction.guild.emojis.cache.forEach((emoji) => {
    if (emoji.animated) {
      emojisAnimated.push(getEmoji(emoji.id));
    } else {
      emojis.push(getEmoji(emoji.id));
    }
  });

  // Function to create an embed with pagination
  function createEmbed(page) {
    const start = page * emojisPerPage;
    const end = start + emojisPerPage;
    const animatedPage = emojisAnimated.slice(start, end).join(' ') || 'None';
    const standardPage = emojis.slice(start, end).join(' ') || 'None';

    // Calculate total pages based on the larger list (animated or standard)
    const totalPages = Math.ceil(Math.max(emojis.length, emojisAnimated.length) / emojisPerPage);

    // Ensure currentPage is within the valid range
    currentPage = Math.max(0, Math.min(currentPage, totalPages - 1));

    return new EmbedBuilder()
      .setTitle('Server Emojis')
	  .setColor(`#7F8C6D`)
      .addFields(
        { name: `Animated [${emojisAnimated.length}]`, value: animatedPage, inline: false },
        { name: `Standard [${emojis.length}]`, value: standardPage, inline: false }
      )
      .setFooter({ text: `Page ${currentPage + 1} / ${totalPages}` });
  }

  // Create buttons for pagination
  const backButton = new ButtonBuilder().setCustomId('back').setEmoji('⬅️').setStyle(ButtonStyle.Secondary).setDisabled(true);
  const forwardButton = new ButtonBuilder().setCustomId('forward').setEmoji('➡️').setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder()
    .addComponents(backButton, forwardButton);

  try {
    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply();
    }

    const message = await interaction.editReply({
      embeds: [createEmbed(currentPage)],
      components: [row]
    });

    // Create a collector to handle button interactions
    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000
    });

    collector.on('collect', async (buttonInteraction) => {
      if (buttonInteraction.user.id === interaction.user.id) {
        if (buttonInteraction.customId === 'back') {
          if (currentPage > 0) currentPage--;
        } else if (buttonInteraction.customId === 'forward') {
          if ((currentPage + 1) * emojisPerPage < Math.max(emojis.length, emojisAnimated.length)) currentPage++;
        }

        // Update button states
        backButton.setDisabled(currentPage === 0);
        forwardButton.setDisabled((currentPage + 1) * emojisPerPage >= Math.max(emojis.length, emojisAnimated.length));

        if ((currentPage + 1) * emojisPerPage >= Math.max(emojis.length, emojisAnimated.length) && emojis.length === 0 && emojisAnimated.length === 0) {
          await buttonInteraction.update({
            embeds: [new EmbedBuilder().setTitle('No emojis left')],
            components: []
          });
        } else {
          await buttonInteraction.update({
            embeds: [createEmbed(currentPage)],
            components: [row]
          });
        }
      }
    });

    // End collector when time expires
    collector.on('end', () => {
      const disabledRow = new ActionRowBuilder()
        .addComponents(
          backButton.setDisabled(true),
          forwardButton.setDisabled(true)
        );

      message.edit({
        components: [disabledRow]
      });
    });

  } catch (error) {
    console.error('Error replying to interaction:', error);
  }
};
