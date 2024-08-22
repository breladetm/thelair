const Discord = require('discord.js');
const Schema = require("../../database/models/guessWord");

module.exports = async (client) => {
  client.on(Discord.Events.MessageCreate, async (message) => {
    if (message.author.bot || message.channel.type === Discord.ChannelType.DM) return;

    let wordList = client.config.wordList.split("\n");

    const data = await Schema.findOne({ Guild: message.guild.id, Channel: message.channel.id });
    if (!data) return;

    if (message.content.toLowerCase() === data.Word.toLowerCase()) {
      // User guessed the correct word
      message.react(client.emotes.normal.check);

      const word = wordList[Math.floor(Math.random() * wordList.length)];
      const shuffled = word.split('').sort(() => 0.5 - Math.random()).join('');
      const amount = Math.floor(Math.random() * 100) + 1;

      // Send the correct word embed
      await client.embed({
        title: `Guess The Word`,
        fields: [
          {
            name: `Winner`,
            value: `${message.author.tag} (\`${message.author.id}\`)`,
            inline: false
          },
          {
            name: `Correct Word`,
            value: `${data.Word}`,
            inline: false
          }
        ]
      }, message.channel);

      // Update the word in the database
      data.Word = word;
      await data.save();

      // Send the shuffled word embed after the correct word embed
      await client.embed({
        title: `Guess The Word`,
        fields: [
          {
            name: `Shuffled Word`,
            value: `${shuffled.toLowerCase()}`
          }
        ]
      }, message.channel);

    } else {
      // User guessed incorrectly
      message.react(client.emotes.normal.error);
    }
  }).setMaxListeners(0);
};
