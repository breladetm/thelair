const Discord = require("discord.js");
const Functions = require("../../database/models/functions");
const afk = require("../../database/models/afk");
const chatBotSchema = require("../../database/models/chatbot-channel");
const messagesSchema = require("../../database/models/messages");
const messageSchema = require("../../database/models/levelMessages");
const messageRewards = require("../../database/models/messageRewards");
const Schema = require("../../database/models/stickymessages");
const levelRewards = require("../../database/models/levelRewards");
const levelLogs = require("../../database/models/levelChannels");
const Commands = require("../../database/models/customCommand");
const CommandsSchema = require("../../database/models/customCommandAdvanced");
const fetch = require("node-fetch");
const db = require("pro.db");

const groq = require("groq-sdk");
const { ai_prompt } = require("../../config/bot");
const Groq = new groq.Groq({
  apiKey: process.env.GROQ
});

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @returns 
 */
module.exports = async (client, message) => {
  const dmlog = new Discord.WebhookClient({
    id: "1272633486284689550",
    token: "QeI5FadbdUQ9JeYp4dTf4dO9svcI7pcUw1a9dNa9OrA4DS5P2UKGMOd7UEcYHRzEssxK",
  });

  if (message.author.bot) return;

  if (message.channel.type === Discord.ChannelType.DM) {
    try {
      await message.react('✅');
      await message.reply('Your report has been forwarded to the administrators.');
    } catch (err) {
      console.error('Failed to handle DM message:', err);
    }

    let embedLogs = new Discord.EmbedBuilder()
      .setTitle(`New Report`)
      .setDescription(`The Lair has received a report. See details below:`)
      .addFields(
        { name: "Author", value: `${message.author.tag} (\`${message.author.id}\`)` },
        { name: `Description`, value: `${message.content || "None"}` },
        { name: `Take Action`, value: `To handle this report, please reach out to ${message.author} via direct messages.` },
      )
      .setColor(client.config.colors.normal)
      .setTimestamp();

    if (message.attachments.size > 0) {
      const attachmentUrl = message.attachments.first()?.url;
      embedLogs.setImage(attachmentUrl);
    }

    return dmlog.send({
      username: "The Lair Reports",
      content: "<@&1100559956903739586>",
      embeds: [embedLogs],
    });
  }

  // Levels
  Functions.findOne({ Guild: message.guild.id }, async (err, data) => {
    if (data && data.Levels) {
      const randomXP = Math.floor(Math.random() * 9) + 1;
      const hasLeveledUp = await client.addXP(
        message.author.id,
        message.guild.id,
        randomXP
      );

      if (hasLeveledUp) {
        const user = await client.fetchLevels(
          message.author.id,
          message.guild.id
        );

        const levelData = await levelLogs.findOne({ Guild: message.guild.id });
        const messageData = await messageSchema.findOne({ Guild: message.guild.id });

        let levelMessage = messageData
          ? messageData.Message
              .replace(`{user:username}`, message.author.username)
              .replace(`{user:discriminator}`, message.author.discriminator)
              .replace(`{user:tag}`, message.author.tag)
              .replace(`{user:mention}`, message.author)
              .replace(`{user:level}`, user.level)
              .replace(`{user:xp}`, user.xp)
          : `**GG** <@!${message.author.id}>, you are now level **${user.level}**`;

        try {
          if (levelData) {
            await client.channels.cache
              .get(levelData.Channel)
              .send({ content: levelMessage });
          } else {
            await message.channel.send({ content: levelMessage });
          }
        } catch (err) {
          console.error('Failed to send level up message:', err);
        }

        levelRewards.findOne(
          { Guild: message.guild.id, Level: user.level },
          async (err, data) => {
            if (data) {
              try {
                message.guild.members.cache
                  .get(message.author.id)
                  .roles.add(data.Role);
              } catch (err) {
                console.error('Failed to assign role on level up:', err);
              }
            }
          }
        );
      }
    }
  });

  // Message tracker system
  messagesSchema.findOne(
    { Guild: message.guild.id, User: message.author.id },
    async (err, data) => {
      if (data) {
        data.Messages += 1;
        data.save();

        messageRewards.findOne(
          { Guild: message.guild.id, Messages: data.Messages },
          async (err, data) => {
            if (data) {
              try {
                message.guild.members.cache
                  .get(message.author.id)
                  .roles.add(data.Role);
              } catch (err) {
                console.error('Failed to assign role on message count:', err);
              }
            }
          }
        );
      } else {
        new messagesSchema({
          Guild: message.guild.id,
          User: message.author.id,
          Messages: 1,
        }).save();
      }
    }
  );

  // AFK system
  afk.findOne(
    { Guild: message.guild.id, User: message.author.id },
    async (err, data) => {
      if (data) {
        await afk.deleteOne({ Guild: message.guild.id, User: message.author.id });

        client
          .simpleEmbed({ desc: `${message.author} is no longer afk!` }, message.channel)
          .then(async (m) => {
            setTimeout(() => {
              m.delete();
            }, 5000);
          });

        if (message.member.displayName.startsWith(`[AFK] `)) {
          let name = message.member.displayName.replace(`[AFK] `, ``);
          message.member.setNickname(name).catch((err) => console.error('Failed to remove AFK nickname:', err));
        }
      }
    }
  );

  message.mentions.users.forEach(async (u) => {
    if (!message.content.includes("@here") && !message.content.includes("@everyone")) {
      afk.findOne({ Guild: message.guild.id, User: u.id }, async (err, data) => {
        if (data) {
          client.simpleEmbed(
            { desc: `${u} is currently afk! **Reason:** ${data.Message}` },
            message.channel
          );
        }
      });
    }
  });

  // Chat bot
  chatBotSchema.findOne({ Guild: message.guild.id }, async (err, data) => {
    if (!data) return;
    if (message.channel.id !== data.Channel) return;

    if (process.env.GROQ) {
      const key = `chat:${message.guild.id}:${message.author.id}`;
      const userChat = db.get(key) || [];
      const messages = [
        ...userChat,
        { role: "user", content: message.cleanContent }
      ];

      const response = await Groq.chat.completions.create({
        messages: [
          { role: "system", content: ai_prompt ?? "you are a helpful assistant." },
          ...messages
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.7,
        max_tokens: 1024,
      });

      let res = response.choices?.[0]?.message?.content || "No response.";

      if (res.length > 1950) {
        res = res.slice(0, 1950) + "... I was unable to send the full response, type `continue`";
      }

      await message.reply({ content: res });

      messages.push({ role: "assistant", content: res });

      db.set(key, messages.slice(-20));
    } else {
      try {
        fetch(`https://api.coreware.nl/fun/chat?msg=${encodeURIComponent(message.content)}&uid=${message.author.id}`)
          .then((res) => res.json())
          .then(async (json) => {
            if (json && json.response) {
              await message.reply({ content: json.response });
            }
          })
          .catch((err) => console.error('Failed to fetch chat bot response:', err));
      } catch (err) {
        console.error('Chat bot error:', err);
      }
    }
  });

  // Sticky messages
  try {
    Schema.findOne({ Guild: message.guild.id, Channel: message.channel.id }, async (err, data) => {
      if (!data) return;

      const lastStickyMessage = await message.channel.messages.fetch(data.LastMessage).catch(() => { });
      if (lastStickyMessage) await lastStickyMessage.delete();

      const newMessage = await client.simpleEmbed({ desc: `${data.Content}` }, message.channel);
      data.LastMessage = newMessage.id;
      data.save();
    });
  } catch (err) {
    console.error('Sticky message error:', err);
  }

  // Prefix
  let guildSettings = await Functions.findOne({ Guild: message.guild.id });
  if (!guildSettings) {
    new Functions({
      Guild: message.guild.id,
      Prefix: client.config.discord.prefix,
    }).save();

    guildSettings = await Functions.findOne({ Guild: message.guild.id });
  }

  let prefix = guildSettings.Prefix;

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
  );

  if (!prefixRegex.test(message.content.toLowerCase())) return;
  const [, matchedPrefix] = message.content.toLowerCase().match(prefixRegex);

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (
    message.mentions.users.first() &&
    message.mentions.users.first().id == client.user.id &&
    command.length === 0
  ) {
    let row = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setLabel("Invite")
        .setURL(client.config.discord.botInvite)
        .setStyle(Discord.ButtonStyle.Link),

      new Discord.ButtonBuilder()
        .setLabel("Support server")
        .setURL(client.config.discord.serverInvite)
        .setStyle(Discord.ButtonStyle.Link)
    );

    return client
      .embed(
        {
          title: "Hi, I am The Lair!",
          fields: [
            {
              name: "What can I do?",
              value: `Check </help:1272624688316551261> for a list of all of my commands.`,
            },
            {
              name: "Do you have an issue with a server member?",
              value:
                "Please send me (<@1272612230004740170>) a direct message and your report will be forwarded to the staff team. Please remember to include who you have an issue with and attach any evidence as an image.",
            },
          ],
        },
        message.channel
      )
      .catch((err) => console.error("Failed to send message:", err));
  }

  // Command handler
  const commandFile =
    client.commands.get(command) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command));

  if (!commandFile) return;

  if (commandFile) {
    try {
      commandFile.run(client, message, args);
    } catch (err) {
      console.error('Command handler error:', err);
    }
  }
};
