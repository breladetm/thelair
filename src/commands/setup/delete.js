const Discord = require('discord.js');

const GTW = require("../../database/models/guessWord");
const welcomeChannel = require("../../database/models/welcomeChannels");
const leaveChannel = require("../../database/models/leaveChannels");

module.exports = async (client, interaction, args) => {
    const options = {
        gtw: GTW,
        welcomechannel: welcomeChannel,
        leavechannel: leaveChannel
    };

    const choice = interaction.options.getString('setup');

    options[choice].findOneAndDelete({ Guild: interaction.guild.id }).then(() => {
        client.succNormal({ 
            text: `The setup has been deleted successfully.`,
            type: 'editreply'
        }, interaction);
    })
}

 