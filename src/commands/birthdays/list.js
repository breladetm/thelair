const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Schema = require("../../database/models/birthday");

module.exports = async (client, interaction, args) => {
    try {
        const rawBirthdayboard = await Schema.find({ Guild: interaction.guild.id });

        if (rawBirthdayboard.length < 1) {
            return client.errNormal({ 
                error: "No birthdays found.",
                type: 'editreply' 
            }, interaction);
        }

        // Sort birthdays by month and then by day within each month
        const sortedBirthdayboard = rawBirthdayboard.sort((a, b) => {
            const dateA = parseBirthday(a.Birthday);
            const dateB = parseBirthday(b.Birthday);

            const monthA = dateA.getMonth();
            const monthB = dateB.getMonth();

            if (monthA === monthB) {
                return dateA.getDate() - dateB.getDate();
            }

            return monthA - monthB;
        });

        // Pagination logic
        const perPage =25;
        let currentPage = 0;
        const totalPages = Math.ceil(sortedBirthdayboard.length / perPage);

        const generateEmbed = (page) => {
            const start = page * perPage;
            const end = start + perPage;
            const lb = sortedBirthdayboard.slice(start, end).map(e => {
                const date = parseBirthday(e.Birthday);
                const formattedDate = `${date.getDate()}${getOrdinalSuffix(date.getDate())} of ${date.toLocaleString('default', { month: 'long' })}`;
                return `${client.emotes.normal.birthday} | \`${e.Username}\` - ${formattedDate}`;
            });

            return new EmbedBuilder()
                .setTitle(`Birthdays - ${interaction.guild.name}`)
                .setDescription(lb.join('\n'))
                .setColor('#7F8C6D')
                .setFooter({ text: `Page ${page + 1} of ${totalPages}` });
        };

        // Create initial embed and buttons
        const embed = generateEmbed(currentPage);

        const backButton = new ButtonBuilder()
            .setCustomId('back')
            .setEmoji(`<:arrowleft:1273009898979852380>`)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === 0);

        const nextButton = new ButtonBuilder()
            .setCustomId('next')
            .setEmoji(`<:arrowright:1273009901777453126>`)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === totalPages - 1);

        const actionRow = new ActionRowBuilder()
            .addComponents(backButton, nextButton);

        const message = await interaction.editReply({ embeds: [embed], components: [actionRow] });

        // Button interaction handler
        const collector = message.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: "You can't interact with this button.", ephemeral: true });
            }

            if (i.customId === 'back' && currentPage > 0) {
                currentPage--;
            } else if (i.customId === 'next' && currentPage < totalPages - 1) {
                currentPage++;
            }

            const newEmbed = generateEmbed(currentPage);

            const updatedBackButton = ButtonBuilder.from(backButton)
                .setDisabled(currentPage === 0);

            const updatedNextButton = ButtonBuilder.from(nextButton)
                .setDisabled(currentPage === totalPages - 1);

            const updatedActionRow = new ActionRowBuilder()
                .addComponents(updatedBackButton, updatedNextButton);

            await i.update({ embeds: [newEmbed], components: [updatedActionRow] });
        });

        collector.on('end', async () => {
            const disabledBackButton = ButtonBuilder.from(backButton).setDisabled(true);
            const disabledNextButton = ButtonBuilder.from(nextButton).setDisabled(true);
            const disabledActionRow = new ActionRowBuilder().addComponents(disabledBackButton, disabledNextButton);
            await interaction.editReply({ components: [disabledActionRow] });
        });
    } catch (error) {
        console.error(error);
        client.errNormal({ 
            error: "An error occurred while retrieving birthdays.",
            type: 'editreply' 
        }, interaction);
    }
};

// Helper function to get the ordinal suffix for a day
function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th'; // covers 11th, 12th, 13th
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

// Helper function to parse the birthday string in the format "13th of August"
function parseBirthday(birthdayString) {
    if (!birthdayString) {
        throw new Error(`Birthday string is undefined or null: ${birthdayString}`);
    }

    const regex = /(\d{1,2})(?:st|nd|rd|th) of (\w+)/;
    const match = birthdayString.match(regex);

    if (!match) {
        throw new Error(`Invalid date format: ${birthdayString}`);
    }

    const day = parseInt(match[1], 10);
    const month = match[2];

    const monthIndex = new Date(`${month} 1, 2000`).getMonth();

    if (isNaN(day) || isNaN(monthIndex)) {
        throw new Error(`Invalid day or month index: ${birthdayString}`);
    }

    return new Date(new Date().getFullYear(), monthIndex, day);
}
