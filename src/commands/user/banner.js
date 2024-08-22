const axios = require('axios');

module.exports = async (client, interaction, args) => {
  try {
    // Get the user from interaction or default to the interaction user
    const user = interaction.options.getUser('user') || interaction.user;

    // Fetch user details from Discord API
    const response = await axios.get(`https://discord.com/api/v10/users/${user.id}`, {
      headers: {
        Authorization: `Bot ${client.token}`,
      },
    });

    const { banner, accent_color: accentColor } = response.data;

    // Check if the user has a banner
    if (banner) {
      // Determine the extension for the banner image
      const extension = banner.startsWith('a_') ? '.gif' : '.png';
      const bannerUrl = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}?size=1024`;

      // Send the banner image
      return client.embed({
        title: 'User Banner',
        image: bannerUrl,
        type: 'editreply',
      }, interaction);
    }

    // If no banner, check for accent color
    if (accentColor) {
      return client.embed({
        title: 'User Banner',
        desc: `${user} doesn't have a banner, but they do have an accent color.`,
        color: accentColor,
        type: 'editreply',
      }, interaction);
    }

    // If no banner and no accent color
    return client.embed({
      title: 'User Banner',
      desc: `${user} doesn't have a banner or an accent color.`,
      type: 'editreply',
    }, interaction);

  } catch (error) {
    console.error('Error fetching user banner:', error);
    return client.errNormal({
      error: 'An error occurred while fetching the user banner.',
      type: 'editreply',
    }, interaction);
  }
};
