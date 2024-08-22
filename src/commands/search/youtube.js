const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {

    let name = encodeURIComponent(interaction.options.getString('name'));
    let link = `https://www.youtube.com/results?search_query=${name}`;

    client.succNormal({
        text: `I have found the following for: \`${name}\``,
        fields: [
            {
                name: `Link`,
                value: `[Click here](${link}) to see the result.`,
                inline: true,
            }
        ], type: 'editreply'
    }, interaction);

}

 