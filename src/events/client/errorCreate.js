const Discord = require('discord.js');
const generator = require('generate-password');

module.exports = (client, err, command, interaction) => {
    // console.log(err); // Removed to stop logging errors to the console

    const password = generator.generate({
        length: 10,
        numbers: true
    });

    const errorlog = new Discord.WebhookClient({
        id: client.webhooks.errorLogs.id,
        token: client.webhooks.errorLogs.token,
    });

    let embed = new Discord.EmbedBuilder()
        .setTitle(`${password}`)
        .addFields(
            { name: "Guild", value: `${interaction.guild.name} (${interaction.guild.id})`},
            { name: `Command`, value: `${command}`},
            { name: `Error`, value: `\`\`\`${err}\`\`\``},
            { name: `Stack error`, value: `\`\`\`${err.stack.substr(0, 1018)}\`\`\``},
        )
        .setColor(client.config.colors.normal);

    errorlog.send({
        username: `The Lair`,
        embeds: [embed],

    }).catch(error => {
        // console.log(error); // Removed to stop logging webhook errors to the console
    });

    let row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setLabel("Support")
                .setURL(client.config.discord.serverInvite)
                .setStyle(Discord.ButtonStyle.Link),
        );

    client.embed({
        title: `Error`,
        desc: `There was an error executing this command`,
        color: client.config.colors.error,
        fields: [
            {
                name: `Error code`,
                value: `\`${password}\``,
                inline: false,
            },
            {
                name: `What now?`,
                value: `Please join the support server and report the bug in [#・bug-reports](https://discord.com/channels/1271091643985952880/1272652006166761538), make sure to include the error code.`,
                inline: false,
            }
        ],
        components: [row],
        type: 'editreply'
    }, interaction).catch(() => {
        client.embed({
            title: `Error`,
            desc: `There was an error executing this command`,
            color: client.config.colors.error,
            fields: [
                {
                    name: `Error code`,
                    value: `\`${password}\``,
                    inline: false,
                },
                {
                    name: `What now?`,
                    value: `Please join the support server and report the bug in [#・bug-reports](https://discord.com/channels/1271091643985952880/1272652006166761538), make sure to include the error code.`,
                    inline: false,
                }
            ],
            components: [row],
            type: 'editreply'
        }, interaction);
    });
};
