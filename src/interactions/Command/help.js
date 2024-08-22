const {
    CommandInteraction,
    Client
} = require('discord.js');
const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require('discord.js');
const moment = require("moment");
require("moment-duration-format");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('The Lair Help'),

    run: async(client, interaction, args) => {
        const toUpperCase = (string) => string.charAt(0).toUpperCase() + string.slice(1);
        const commad = (name) => {
            const mentions = client.getSlashMentions(name); // array of [mention, description]
            return mentions.map(cmd => `${cmd[0]} - \`${cmd[1]}\``).join("\n");
        };

        let em1 = new EmbedBuilder()
            .setAuthor({
                name: `The Lair`,
                iconURL: client.user.displayAvatarURL({
                    format: "png"
                })
            })
            .setColor(`#7F8C6D`)
            .addFields([{
                name: "Welcome to the help menu for The Lair.",
                value: "> Please click on the buttons to view all available commands.",
                inline: false
            }]);

        let backButton = new ButtonBuilder().setStyle(2).setEmoji(`<:arrowleft:1273009898979852380>`).setCustomId('back'),
            forwardButton = new ButtonBuilder().setStyle(2).setEmoji(`<:arrowright:1273009901777453126>`).setCustomId('forward');

        const options = [{
            label: 'Overview',
            value: '0'
        }];
        const options2 = [];

        let counter = 0;
        let counter2 = 25;

        const firstSet = fs.readdirSync(`${process.cwd()}/src/commands`).slice(0, 24);
        const secondSet = fs.readdirSync(`${process.cwd()}/src/commands`).slice(25, 37);

        firstSet.forEach(dirs => {
            counter++;
            const opt = {
                label: toUpperCase(dirs.replace("-", " ")),
                value: `${counter}`
            };
            options.push(opt);
        });

        secondSet.forEach(dirs => {
            counter2++;
            const opt = {
                label: toUpperCase(dirs.replace("-", " ")),
                value: `${counter2}`
            };
            options2.push(opt);
        });

        let menu = new StringSelectMenuBuilder().setPlaceholder('Change page').setCustomId('pagMenu').addOptions(options).setMaxValues(1).setMinValues(1),
            menu2 = new StringSelectMenuBuilder().setPlaceholder('Change page').setCustomId('pagMenu2').addOptions(options2).setMaxValues(1).setMinValues(1);

        let group1 = new ActionRowBuilder().addComponents(menu);
        let group2 = new ActionRowBuilder().addComponents(backButton.setDisabled(true), forwardButton.setDisabled(false));
        let group3 = new ActionRowBuilder().addComponents(menu2);

        const components = [group2, group1];
        if (options2.length > 0) {
            components.push(group3);
        }

        let helpMessage = await interaction.reply({
            embeds: [em1],
            components: components,
        });

        const collector = helpMessage.createMessageComponentCollector((button) => button.user.id === interaction.user.id, {
            time: 60e3
        });

        var embeds = [em1];

        fs.readdirSync(`${process.cwd()}/src/commands`).forEach(dirs => {
            embeds.push(new EmbedBuilder().setAuthor({
                name: toUpperCase(dirs),
                iconURL: client.user.displayAvatarURL({
                    format: "png"
                }),
                url: `https://discord.gg/thelair69` // replace with your actual link
            }).setDescription(`${commad(dirs)}`).setColor(`#7F8C6D`));
        });

        let currentPage = 0;

        collector.on('collect', async(b) => {
            if (b.user.id !== interaction.user.id)
                return b.reply({
                    content: `**You Can't Use it\n**`,
                    ephemeral: true
                });

            switch (b.customId) {
                case 'back':
                    --currentPage;
                    if (currentPage === 0) {
                        group2 = new ActionRowBuilder().addComponents([backButton.setDisabled(true), forwardButton.setDisabled(false)]);
                    } else {
                        group2 = new ActionRowBuilder().addComponents([backButton.setDisabled(false), forwardButton.setDisabled(false)]);
                    }
                    b.update({
                        embeds: [embeds[currentPage]],
                        components: components
                    });
                    break;
                case 'forward':
                    ++currentPage;
                    if (currentPage === embeds.length - 1) {
                        group2 = new ActionRowBuilder().addComponents([backButton.setDisabled(false), forwardButton.setDisabled(true)]);
                    } else {
                        group2 = new ActionRowBuilder().addComponents([backButton.setDisabled(false), forwardButton.setDisabled(false)]);
                    }
                    b.update({
                        embeds: [embeds[currentPage]],
                        components: components
                    });
                    break;
                case 'pagMenu':
                    currentPage = parseInt(b.values[0]);
                    if (currentPage === 0) {
                        group2 = new ActionRowBuilder().addComponents([backButton.setDisabled(true), forwardButton.setDisabled(false)]);
                    } else if (currentPage === embeds.length - 1) {
                        group2 = new ActionRowBuilder().addComponents([backButton.setDisabled(false), forwardButton.setDisabled(true)]);
                    } else {
                        group2 = new ActionRowBuilder().addComponents([backButton.setDisabled(false), forwardButton.setDisabled(false)]);
                    }
                    b.update({
                        embeds: [embeds[currentPage]],
                        components: components
                    });
                    break;
                default:
                    break;
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                const disabledComponents = components.map(componentRow => {
                    return new ActionRowBuilder().addComponents(
                        componentRow.components.map(component => component.setDisabled(true)));
                });

                helpMessage.edit({
                    content: 'This help menu has expired. Please use the `/help` command again to reopen it.',
                    embeds: [embeds[currentPage]],
                    components: disabledComponents,
                });
            }
        });
    }
};
