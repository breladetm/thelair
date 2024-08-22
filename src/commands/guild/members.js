const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
  const members = await interaction.guild.members.fetch();

  client.embed({
    title: `Membercount`,
    fields: [
      {
        name: `Members`,
        value: `${members.filter(member => !member.user.bot).size} members`,
        inline: false
      },
      
      {
        name: `Bots`,
        value: `${members.filter(member => member.user.bot).size} bots`,
        inline: false
      },
      {
        name: `Total`,
        value: `${interaction.guild.memberCount} members`,
        inline: false
      }
    ],
    type: 'editreply'
  }, interaction)
}

   