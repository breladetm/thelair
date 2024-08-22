const Discord = require('discord.js');
const mongoose = require('mongoose');
const moment = require("moment");

module.exports = async (client, interaction, args) => {
    client.simpleEmbed({
        desc: `Calculating ping...`,
        type: 'editreply'
    }, interaction).then((resultMessage) => {
        const ping = Math.floor(resultMessage.createdTimestamp - interaction.createdTimestamp);
        const duration = moment.duration(client.uptime).format("D [days], H [hrs], m [mins], s [secs]");

        mongoose.connection.db.admin().ping(function (err, result) {
            var mongooseSeconds = ((result.ok % 60000) / 1000);
            var pingSeconds = ((ping % 60000) / 1000);
            var apiSeconds = ((client.ws.ping % 60000) / 1000);

            const description = `
> **Time:** ${ping}ms
> **Version:** ${require(`${process.cwd()}/package.json`).version}
> **Uptime:** ${duration}
> **Memory:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
> **API Latency:** ${client.ws.ping}ms
> **Database Latency:** ${result.ok}ms
> **Servers:** ${client.guilds.cache.size}
            `;

            client.embed({
                title: `Pong`,
                desc: description,
                type: 'editreply'
            }, interaction);
        });
    });
};
