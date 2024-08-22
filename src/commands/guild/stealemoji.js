const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
  const perms = await client.checkPerms({
    flags: [Discord.PermissionsBitField.Flags.ManageEmojisAndStickers],
    perms: [Discord.PermissionsBitField.Flags.ManageEmojisAndStickers]
  }, interaction)

  if (perms == false) return;

  const rawEmoji = interaction.options.getString('emoji');
  const role = interaction.options.getRole('role');
  const parsedEmoji = Discord.parseEmoji(rawEmoji);

  if (parsedEmoji.id) {
    const extension = parsedEmoji.animated ? ".gif" : ".png";
    const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`;
    if (role) {

      interaction.guild.emojis.create({ attachment: url, name: parsedEmoji.name, roles: [role.id] }).then(emoji => {
        client.succNormal({
          text: `Emoji successfully added to the server`,
          fields: [
            {
              name: "Emoji",
              value: `${emoji}`,
              inline: false,
            },
            {
              name: "Name",
              value: `${emoji.name}`,
              inline: false,
            },
            {
              name: "ID",
              value: `${emoji.id}`,
              inline: false,
            },
          ],
          type: 'editreply'
        }, interaction)
      })
    }else{
      interaction.guild.emojis.create({ attachment: url, name: parsedEmoji.name }).then(emoji => {
        client.succNormal({
          text: `I have stolen the emoji.`,
          fields: [
            {
              name: "Emoji",
              value: `${emoji}`,
              inline: false,
            },
            {
              name: "Name",
              value: `${emoji.name}`,
              inline: false,
            },
            {
              name: "ID",
              value: `${emoji.id}`,
              inline: false,
            },
          ],
          type: 'editreply'
        }, interaction)
      })
    }
  }
  else {
    client.errNormal({
      error: "I could not find the emoji",
      type: 'editreply'
    }, interaction)
  }
}
