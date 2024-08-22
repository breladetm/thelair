const Discord = require('discord.js');
const Schema = require("../../database/models/birthday");

const months = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12
};

// Utility function to convert human-readable date to Date object
function parseHumanReadableDate(birthdayString) {
    const [daySuffix, monthName] = birthdayString.split(' of ');
    const day = parseInt(daySuffix); // Extract day
    const month = months[monthName]; // Convert month name to number
    const currentYear = new Date().getFullYear();

    // Return a new Date object for the current year
    return new Date(currentYear, month - 1, day);
}

module.exports = async (client, interaction, args) => {
    Schema.findOne({ Guild: interaction.guild.id, Username: interaction.user.username }, async (err, data) => {
        if (err || !data) {
            return client.errNormal({
                error: "No birthday found for this user.",
                type: 'editreply'
            }, interaction);
        }

        // Convert human-readable date to Date object
        let birthday;
        try {
            birthday = parseHumanReadableDate(data.Birthday);
            if (isNaN(birthday.getTime())) {
                throw new Error("Invalid date after parsing");
            }
        } catch (error) {
            console.error(error);
            return client.errNormal({
                error: "Invalid birthday date format.",
                type: 'editreply'
            }, interaction);
        }

        const now = new Date();
        // Adjust birthday to current year
        birthday.setFullYear(now.getFullYear());
        // If birthday has already passed this year, set it to the next year
        if (birthday < now) {
            birthday.setFullYear(now.getFullYear() + 1);
        }

        // Calculate the difference in days
        const timeDiff = birthday - now;
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        let imageUrl;

        // Determine the appropriate image based on the number of days
        if (daysDiff <= 30) {
            imageUrl = "https://media1.tenor.com/m/a_Aec257h4YAAAAC/dog-husky.gif";
        } else if (daysDiff <= 60) {
            imageUrl = "https://media1.tenor.com/m/LqPwUfj3fwMAAAAC/puppet-red.gif";
        } else if (daysDiff <= 120) {
            imageUrl = "https://media1.tenor.com/m/onjjYkqW-mYAAAAC/ateu.gif";
        } else if (daysDiff <= 260) {
            imageUrl = "https://media1.tenor.com/m/S0lM-xzKw54AAAAC/not-quite-kory-stamper.gif";
        } else if (daysDiff <= 365) {
            imageUrl = "https://media1.tenor.com/m/x0lpkIb1u5wAAAAC/it-going-to-take-some-time-ashnichrist.gif";
        }

        if (imageUrl) {
            client.embed({
                title: `Birthdays`,
                desc: `Your birthday is on ${data.Birthday}`,
                image: imageUrl,
                type: 'editreply'
            }, interaction);
        } else {
            // Send a message if no relevant image is available
            await interaction.editReply({
                content: `Your birthday is more than 365 days away.`,
                embeds: [] // No embed if there's no image to display
            });
        }
    });
}
