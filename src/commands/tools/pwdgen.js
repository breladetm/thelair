const Discord = require('discord.js');
const generator = require('generate-password');

module.exports = async (client, interaction, args) => {

    const password = generator.generate({
        length: 12,
        symbols: true,
        numbers: true
    });

    client.succNormal({ text: `Please check your direct messages for the password.`, type: 'editreply' }, interaction);

    client.succNormal({
        text: `Your generated password`,
        fields: [
            {
                name: "Password",
                value: `${password}`,
                inline: true,
            },
            {
                name: "Length",
                value: `12`,
                inline: true,
            }
        ]
    }, interaction.user)

}

 