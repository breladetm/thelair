const Discord = require('discord.js');
const model = require('../../database/models/badge');

const webhookClientLogs = new Discord.WebhookClient({
    id: "1272653305666998272",
    token: "PIXBN-0XjykwVks7HLzcke0qj-uF1jnPCq6v3L66YipUGB08ztQUsQjE_Z9lTd-LZKXW",
});

module.exports = async (client, interaction, args) => {
    const badgeFlags = {
        DEVELOPER: client.emotes.badges.developer,
        TEAM: client.emotes.badges.team,
		LAIRSTAFF: client.emotes.badges.lairstaff,
		BUGHUNTER: client.emotes.badges.bughunter,
        PARTNER: client.emotes.badges.partner,
        HOE: client.emotes.badges.hoe
    }

    const badge = interaction.options.getString('badge');
    const member = interaction.options.getUser('user');

    if (!badgeFlags[badge.toUpperCase()]) return client.errNormal({
        error: `I was unable to find that flag.`,
        type: `editreply`
    }, interaction);

    let Badges = await model.findOne({ User: member.id });

    if (!Badges || !Badges.FLAGS.includes(badge.toUpperCase())) return client.errNormal({
        error: `${member.username} (\`${member.id}\`) doesn't have that flag.`,
        type: `editreply`
    }, interaction);

    let FLAG = badge.toUpperCase();
    let array = Badges.FLAGS;

    for (var i = 0; i < array.length; i++) {
        if (array[i] === FLAG) {
            array.splice(i, 1);
            i--;
        }
    }

    if (!array.length) {
        await model.deleteMany({ User: member.id });
        client.succNormal({
            text: `I have removed the ${badgeFlags[badge.toUpperCase()]} (\`${badge.toUpperCase()}\`) flag from ${member.username} (\`${member.id}\`).`,
            type: 'editreply'
        }, interaction);
    } else {
        model.findOne({ User: member.id }, async (err, data) => {
            if (err) console.log(err);
            data.FLAGS = array;
            data.save();
        });
        client.succNormal({
            text: `I have removed the ${badgeFlags[badge.toUpperCase()]} (\`${badge.toUpperCase()}\`) flag from ${member.username} (\`${member.id}\`).`,
            type: 'editreply'
        }, interaction);
    }

    let embedLogs = new Discord.EmbedBuilder()
        .setTitle(`Flags`)
        .setDescription(`Removed a flag from ${member.username} (\`${member.id}\`)`)
        .addFields(
            { name: "Moderator", value: `${interaction.user.username} (\`${interaction.user.id}\`)`, inline: false },
            { name: `Flag`, value: `${badgeFlags[badge.toUpperCase()]} (\`${badge.toUpperCase()}\`)`, inline: false },
        )
        .setColor(client.config.colors.normal)
        .setFooter({ text: client.config.discord.footer })
        .setTimestamp();
    webhookClientLogs.send({
        username: 'The Lair',
        embeds: [embedLogs],
    });
}
