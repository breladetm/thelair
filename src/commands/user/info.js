const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
  try {
    // Check if a user was provided; if not, default to the interaction user
    const user = interaction.options.getUser('user') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);
    
    if (!member) {
      return client.errNormal({
        error: "I could not find this user.",
        type: 'editreply'
      }, interaction);
    }

    const roles = member.roles.cache
      .sort((a, b) => b.position - a.position)
      .map(role => role.toString())
      .slice(0, -1); // Exclude @everyone role

    return client.embed({
      title: `User Information`,
      thumbnail: member.user.displayAvatarURL({ dynamic: true, size: 1024 }),
      image: member.user.bannerURL({ dynamic: true, size: 1024 }),
      fields: [
        {
          name: "Username",
          value: `${member.user.username}`,
          inline: false,
        },
        {
          name: "Nickname",
          value: `${member.nickname || 'None'}`,
          inline: false,
        },
        {
          name: "ID",
          value: `${member.user.id}`,
          inline: false,
        },
        {
          name: "Account Creation",
          value: `<t:${Math.round(member.user.createdTimestamp / 1000)}>`,
          inline: false,
        },
        {
          name: "Joined Server",
          value: `<t:${Math.round(member.joinedAt / 1000)}>`,
          inline: false,
        },
        {
          name: `Roles [${roles.length}]`,
          value: `${roles.length ? roles.join(', ') : 'None'}`,
          inline: false,
        }
      ],
      type: 'editreply'
    }, interaction);
  } catch (error) {
    console.error('Error handling interaction:', error);
    return client.errNormal({
      error: "An error occurred while processing the command.",
      type: 'editreply'
    }, interaction);
  }
};
