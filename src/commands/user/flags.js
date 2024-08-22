const Discord = require('discord.js');
const model = require('../../database/models/badge');

module.exports = async (client, interaction, args) => {
  try {
    const user = interaction.options.getUser('user') || interaction.user;
    const userId = user.id;
    const member = await interaction.guild.members.fetch(userId);
    
    if (!member) {
      return client.errNormal({
        error: "This user is not in this guild!",
        type: 'editreply'
      }, interaction);
    }

    const badgeFlags = {
      DEVELOPER: client.emotes.badges.developer,
      TEAM: client.emotes.badges.team,
      PARTNER: client.emotes.badges.partner,
      LAIRSTAFF: client.emotes.badges.lairstaff,
      BUGHUNTER: client.emotes.badges.bughunter,
      HOE: client.emotes.badges.hoe,

    };

    // Define the display names for badges
    const badgeDisplayNames = {
      DEVELOPER: 'Developer',
      TEAM: 'Team',
      PARTNER: 'Partner',
      LAIRSTAFF: 'Lair Staff',
      BUGHUNTER: 'Bug Hunter',
      HOE: 'Hoe'
    };

    const badgeHierarchy = ['DEVELOPER', 'TEAM', 'PARTNER', 'LAIRSTAFF', 'BUGHUNTER', 'HOE'];

    let Badges = await model.findOne({ User: member.user.id });
    if (!Badges) Badges = { User: member.user.id, FLAGS: [] };

    const sortedBadges = badgeHierarchy.filter(flag => Badges.FLAGS.includes(flag));
    const badgeDescriptions = sortedBadges.length
      ? sortedBadges.map(flag => `${badgeFlags[flag]} ${badgeDisplayNames[flag]}`).join('\n')
      : 'User has no acknowledgements';

    const embed = new Discord.EmbedBuilder()
      .setDescription(badgeDescriptions)
      .setColor(client.config.colors.normal)
      .setAuthor({ 
        name: `${member.user.username} (${member.user.id})`, 
        iconURL: member.user.displayAvatarURL({ dynamic: true })
      });

    return client.sendEmbed({
      embeds: [embed],
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
