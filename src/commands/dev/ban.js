const Discord = require('discord.js');
const Schema = require('../../database/models/userBans');

const webhookClientLogs = new Discord.WebhookClient({
    id: "1273118822983008256",
    token: "nCRUTComMTrgwXJgR9mfp54XdnfFACBMlZaY0wDDFYWuLWRChlip8sHgUSiGFjtUpdHh",
});

module.exports = async (client, interaction, args) => {
    const action = interaction.options.getString('action');
    const member = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    if (action === 'ban') {
        if (member.id === interaction.user.id) {
            return client.succNormal({
                text: 'You cannot blacklist yourself.',
                type: 'editreply'
            }, interaction);
        }

        Schema.findOne({ User: member.id }, async (err, data) => {
            if (data) {
                return client.succNormal({
                    text: `${member.username} (\`${member.id}\`) is already blacklisted.`,
                    type: 'editreply'
                }, interaction);
            } else {
                new Schema({ User: member.id }).save();

                client.succNormal({
                    text: `${member.username} (\`${member.id}\`) was blacklisted.`,
                    type: 'editreply'
                }, interaction);

                let embedLogs = new Discord.EmbedBuilder()
                    .setTitle('Blacklists')
                    .addFields(
                        { name: 'Moderator', value: `${interaction.user.username} (\`${interaction.user.id}\`)`, inline: false },
                        { name: 'Offender', value: `${member.username} (\`${member.id}\`)`, inline: false },
                        { name: 'Reason', value: `${reason}`, inline: false }
                    )
                    .setColor(client.config.colors.normal)
                    .setFooter({ text: client.config.discord.footer })
                    .setTimestamp();

                webhookClientLogs.send({
                    username: 'The Lair',
                    embeds: [embedLogs],
                });
            }
        });
    } else if (action === 'unban') {
        Schema.findOne({ User: member.id }, async (err, data) => {
            if (data) {
                Schema.findOneAndDelete({ User: member.id }).then(() => {
                    client.succNormal({
                        text: `${member.username} (\`${member.id}\`) had their blacklist removed.`,
                        type: 'editreply'
                    }, interaction);

                    let embedLogs = new Discord.EmbedBuilder()
                        .setTitle('Blacklists')
                        .addFields(
                            { name: 'Moderator', value: `${interaction.user.username} (\`${interaction.user.id}\`)`, inline: false },
                            { name: 'Offender', value: `${member.username} (\`${member.id}\`)`, inline: false },
                            { name: 'Reason', value: `${reason}`, inline: false }
                        )
                        .setColor(client.config.colors.normal)
                        .setFooter({ text: client.config.discord.footer })
                        .setTimestamp();

                    webhookClientLogs.send({
                        username: 'The Lair',
                        embeds: [embedLogs],
                    });
                });
            } else {
                return client.succNormal({
                    text: `${member.username} (\`${member.id}\`) is not blacklisted.`,
                    type: 'editreply'
                }, interaction);
            }
        });
    }
};
