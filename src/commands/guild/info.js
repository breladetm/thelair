const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
  let verifLevels = {
    "0": "None",
    "1": "Low",
    "2": "Medium",
    "3": "(╯°□°）╯︵  ┻━┻",
    "4": "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
  }

  let region = {
    "brazil": `:flag_br: `,
    "eu-central": `:flag_eu: `,
    "singapore": `:flag_sg: `,
    "us-central": `:flag_us: `,
    "sydney": `:flag_au: `,
    "us-east": `:flag_us: `,
    "us-south": `:flag_us: `,
    "us-west": `:flag_us: `,
    "eu-west": `:flag_eu: `,
    "vip-us-east": `:flag_us: `,
    "europe": `:flag_gb:`,
    "amsterdam": `:flag_nl:`,
    "hongkong": `:flag_hk: `,
    "russia": `:flag_ru: `,
    "southafrica": `:flag_za: `
  }

  let tier = {
     "0": "None",
    "1": "TIER 1",
    "2": "TIER 2",
    "3": "**TIER 3**"
  }

  const members = await interaction.guild.members.fetch();

  client.embed({
    title: `Server Information`,
    thumbnail: interaction.guild.iconURL({ dynamic: true, size: 1024 }),
    image: interaction.guild.bannerURL({ size: 1024 }),
    fields: [
      {
        name: "Name",
        value: `${interaction.guild.name}`,
        inline: false,
      },
      {
        name: "ID",
        value: `${interaction.guild.id}`,
        inline: false,
      },
      {
        name: "Owner",
        value: `<@!${interaction.guild.ownerId}>`,
        inline: false
      },
      {
        name: "Boost Tier",
        value: `${tier[interaction.guild.premiumTier]}`,
        inline: false
      },
      {
        name: "Boost Count",
        value: `${interaction.guild.premiumSubscriptionCount || '0'} boosts`,
        inline: false
      },
      {
        name: "Created",
        value: `<t:${Math.round(interaction.guild.createdTimestamp / 1000)}>`,
        inline: false
      },
      {
        name: "Members",
        value: `${interaction.guild.memberCount} members`,
        inline: false
      },
      {
        name: "Text Channels",
        value: `${interaction.guild.channels.cache.filter(channel => channel.type === Discord.ChannelType.GuildText).size} channels`,
        inline: false
      },
      {
        name: "Voice Channels",
        value: `${interaction.guild.channels.cache.filter(channel => channel.type ===  Discord.ChannelType.GuildVoice).size} channels`,
        inline: false
      },
      {
        name: "Roles",
        value: `${interaction.guild.roles.cache.size} roles`,
        inline: false
      },
      {
        name: "Emojis",
        value: `${interaction.guild.emojis.cache.size} emoji's`,
        inline: false
      },
      {
        name: "Stickers",
        value: `${interaction.guild.stickers.cache.size} stickers`,
        inline: false
      }
    ],
    type: 'editreply'
  }, interaction)
}

   
