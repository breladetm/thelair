const Discord = require('discord.js');
const Schema = require("../../database/models/birthday");

module.exports = async (client, interaction, args) => {
    Schema.findOne({ Guild: interaction.guild.id, Username: interaction.user.username }, async (err, data) => {
        if (err || !data) {
            return client.errNormal({ 
                error: "No birthday found for this user.",
                type: 'editreply' 
            }, interaction);
        }

        Schema.findOneAndDelete({ Guild: interaction.guild.id, Username: interaction.user.username }).then(() => {
            client.succNormal({ 
                text: "I have deleted your birthday.", 
                type: 'editreply' 
            }, interaction);
        }).catch(error => {
            console.error(error);
            client.errNormal({ 
                error: "An error occurred while deleting the birthday.",
                type: 'editreply' 
            }, interaction);
        });
    });
}
