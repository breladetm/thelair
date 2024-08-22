const Discord = require('discord.js');

module.exports = async (client, interaction) => {
    const option = interaction.options.getString("option");
    const options = ["rock", "paper", "scissors"];
    const result = options[Math.floor(Math.random() * options.length)];

    let outcome;
    
    if (option === result) {
        outcome = "it's a draw!";
    } else if (
        (option === "rock" && result === "scissors") ||
        (option === "paper" && result === "rock") ||
        (option === "scissors" && result === "paper")
    ) {
        outcome = "you win!";
    } else {
        outcome = "I win!";
    }

    return client.embed({
        title: `Rock Paper Scissors`,
        desc: `I chose ${result}, ${outcome}`,
        type: 'editreply'
    }, interaction);
}
