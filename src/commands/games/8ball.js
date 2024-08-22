const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    // Get the question from the interaction options
    const question = interaction.options.getString('question');

    // Array of possible responses
    const responses = [
        "Yes!",
        "Unfortunately not",
        "You are absolutely right!",
        "No, sorry.",
        "I agree",
        "No idea!",
        "I am not that smart ..",
        "My sources say no!",
        "It is certain",
        "You can rely on it",
        "Probably not",
        "Everything points to a no",
        "No doubt",
        "Absolutely",
        "I do not know",
        "Spicy says get fucked",
        "Vin says in your dreams nerd",
        "Ren says try again hoe"

    ];

    // Get a random response
    const randomIndex = Math.floor(Math.random() * responses.length);
    const answer = responses[randomIndex];

    // Send the embedded message with the question and answer
    client.embed({
        title: `Magic 8ball`,
        fields: [
            {
                name: 'Question',
                value: `\`\`\`${question}\`\`\``,
                inline: false
            },
            {
                name: 'Answer',
                value: `\`\`\`${answer}\`\`\``,
                inline: false
            }
        ],
        type: 'editreply'
    }, interaction);
};
