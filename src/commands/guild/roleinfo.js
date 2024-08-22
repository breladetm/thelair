const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
  const role = interaction.options.getRole('role');
  const perms = role.permissions.toArray();

  client.embed({
    title: `Role Information`,
    thumbnail: interaction.guild.iconURL({ dynamic: true, size: 1024 }),
    fields: [
      {
        name: 'ID',
        value: `${role.id}`,
        inline: false
      },
      {
        name: 'Name',
        value: `${role.name}`,
        inline: false
      },
      {
        name: 'Mentionable',
        value: `${role.mentionable ? 'Yes' : 'No'}`,
        inline: false
      },
      {
        name: 'Permissions',
        value: `${perms.join(', ')}`
		inline: false
      }
    ],
    type: 'editreply'
  }, interaction)
}

   