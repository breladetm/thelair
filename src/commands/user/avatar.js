module.exports = async (client, interaction, args) => {
  const user = interaction.options.getUser('user') || interaction.user;
  const serverOption = interaction.options.getString('server');

  if (!interaction.guild) {
    return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
  }

  let avatarURL;
  let title;

  if (serverOption === 'true') {
    // Fetch the GuildMember object to get the server-specific avatar
    const guildMember = await interaction.guild.members.fetch(user.id);
    avatarURL = guildMember.displayAvatarURL({ dynamic: false, size: 1024 });
    title = 'Server Avatar'; // Title for server-specific avatar
  } else {
    // Get the global avatar URL
    avatarURL = user.displayAvatarURL({ dynamic: false, size: 1024 });
    title = 'Global Avatar'; // Title for global avatar
  }

  client.embed({
    title: title,
    image: avatarURL,
    type: 'editreply'
  }, interaction);
};
