const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {

    const text = interaction.options.getString('text');

    let encode = text.split("").map(x => x.charCodeAt(0).toString(2)).join(" ");

    client.embed({
        title: `Success`,
        desc: `I have encoded your text to binary`,
        fields: [
            {
                name: "Input",
                value: `\`\`\`${text}\`\`\``,
                inline: false,
            },
            {
                name: "Output",
                value: `\`\`\`${encode}\`\`\``,
                inline: false,
            },
        ],
        type: 'editreply'
    }, interaction)

}

 