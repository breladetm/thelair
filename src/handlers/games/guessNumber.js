const Discord = require('discord.js');
const Schema = require("../../database/models/guessNumber");

module.exports = async (client) => {
  client.on(Discord.Events.MessageCreate, async (message) => {
    if (message.author.bot || message.channel.type === Discord.ChannelType.DM) return;

    const data = await Schema.findOne({ Guild: message.guild.id, Channel: message.channel.id });
    if (!data) return;

    const number = parseInt(data.Number);
    const userNumber = parseInt(message.content);
    if (isNaN(userNumber)) return;

    if (userNumber === number) {
      // User guessed the correct number
      message.react(client.emotes.normal.check);

      const newNumber = Math.ceil(Math.random() * 5000);
      const amount = Math.floor(Math.random() * 100) + 1;

      client.addMoney(message, message.author, amount);

      client.embed({
        title: `Guess The Number`,
        desc: `The number is between **1** and **5,000**!`,
        fields: [
          {
            name: `Winner`,
            value: `${message.author} (${message.author.tag})`,
            inline: false
          },
          {
            name: `Correct Number`,
            value: `${data.Number}`,
            inline: true
          }
        ]
      }, message.channel);

      // Update the number in the database
      data.Number = newNumber;
      await data.save();

      client.embed({
        title: `Guess The Number`,
        desc: `The number is between **1** and **5,000**!`
      }, message.channel);

    } else if (userNumber > number) {
      // User's guess is too high
      message.react(client.emotes.normal.arrowDown);

    } else if (userNumber < number) {
      // User's guess is too low
      message.react(client.emotes.normal.arrowUp);
    }
  }).setMaxListeners(0);
};
