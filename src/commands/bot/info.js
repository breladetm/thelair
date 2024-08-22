const Discord = require('discord.js');
const moment = require("moment");
require("moment-duration-format");

module.exports = async (client, interaction, args) => {
  const duration = moment.duration(client.uptime).format("\`D\` [d], \`H\` [h], \`m\` [m], \`s\` [s]");

  client.embed({
    thumbnail: client.user.avatarURL({ size: 1024 }),
    fields: [
      {
        name: "Information",
        value: `The Lair is a private all-in-one moderation, utility and invite tracker bot for **🌿 ＴＨＥ ＬＡＩＲ 🌿**.`,
        inline: false,
      },
      {
        name: "Username",
        value: `${client.user.username}`,
        inline: false,
      },
      {
        name: "User ID",
        value: `${client.user.id}`,
        inline: false,
      },
      {
        name: "Owners",
        value: `brelade (\`1086281889716912259\`), spicymama. (\`994399738503901275\`)`,
        inline: false,
      },
      {
        name: "Developer",
        value: `brelade (\`1086281889716912259\`)`,
        inline: false,
      },
      {
        name: "Commands",
        value: `\`${client.commands.size}\``,
        inline: false,
      },
      {
        name: "Members",
        value: `\`${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}\``,
        inline: false,
      },
      {
        name: "Channels",
        value: `\`${client.channels.cache.size}\``,
        inline: false,
      },
      {
        name: "Created",
        value: `<t:${Math.round(client.user.createdTimestamp / 1000)}>`,
        inline: false,
      }],
    type: 'editreply'
  }, interaction)

}


