const Discord = require('discord.js');
const sourcebin = require('sourcebin');

module.exports = async (client, interaction, args) => {

    const language = interaction.options.getString('language');
    const code = interaction.options.getString('code');

    const bin = await sourcebin.create(
        [
            {
                content: `${code}`,
                language: `${language}`,
            },
        ],
        {
            title: 'Code',
            description: 'This code was uploaded by The Lair.',
        },
    ).then(value => {
        client.succNormal({
            text: `Your code has been posted!`,
            fields: [
                {
                    name: `Link`,
                    value: `[Click here](${value.url}) to see your code.`,
                    inline: true,
                }
            ],
            type: 'editreply'
        }, interaction);
    })

}

 