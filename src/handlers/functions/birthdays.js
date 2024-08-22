const { EmbedBuilder } = require('discord.js');
const Schema = require("../../database/models/birthday");
const Devs = require("../../database/models/developers");

module.exports = (client) => {
    const scheduleNextCheck = () => {
        const now = new Date();
        
        // Central Time (UTC-6 or UTC-5 during Daylight Saving Time)
        const centralTimeOffset = -6;
        const centralTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (centralTimeOffset * 3600000));

        // Calculate time until next midnight
        const nextMidnight = new Date(centralTime);
        nextMidnight.setHours(24, 0, 0, 0); // Set to midnight

        const timeUntilNextMidnight = nextMidnight.getTime() - centralTime.getTime();

        // Schedule checkBirthdays to run at midnight Central Time
        setTimeout(checkBirthdays, timeUntilNextMidnight);
    };

    const checkBirthdays = async () => {
        // Get the current time at Central Time
        const now = new Date();
        const centralTimeOffset = -6; // UTC-6 for Central Standard Time (CST)
        const centralTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (centralTimeOffset * 3600000));

        const month = centralTime.getMonth() + 1; // Months are 0-indexed in JavaScript
        const day = centralTime.getDate();

        const dateNow = `${day} - ${month}`;

        try {
            // Update or create the last checked date
            const getLastDate = await Devs.findOne({ Action: "Birthday" }).exec();
            if (getLastDate) {
                const lastDate = getLastDate.Date;
                if (lastDate === dateNow) {
                    // If today's date has been checked already, schedule the next check for tomorrow's midnight
                    scheduleNextCheck();
                    return;
                }
                getLastDate.Date = dateNow;
                await getLastDate.save();
            } else {
                await new Devs({
                    Action: "Birthday",
                    Date: dateNow,
                }).save();
            }

            // Define month names
            const months = {
                1: "January",
                2: "February",
                3: "March",
                4: "April",
                5: "May",
                6: "June",
                7: "July",
                8: "August",
                9: "September",
                10: "October",
                11: "November",
                12: "December"
            };

            // Format today's date for comparison
            const convertedDay = suffixes(day);
            const convertedMonth = months[month];
            const birthdayString = `${convertedDay} of ${convertedMonth}`;

            // Find all users with birthdays today
            const results = await Schema.find({ Birthday: birthdayString });

            if (results.length > 0) {
                const guildMessages = {};

                for (const result of results) {
                    const { Guild, UserID, Username } = result;
                    const finalGuild = client.guilds.cache.get(Guild);

                    if (finalGuild) {
                        if (!guildMessages[Guild]) {
                            guildMessages[Guild] = [];
                        }
                        guildMessages[Guild].push(`<@${UserID}>`); // Use UserID for mention
                    }
                }

                for (const [guildId, mentions] of Object.entries(guildMessages)) {
                    const finalGuild = client.guilds.cache.get(guildId);

                    if (finalGuild) {
                        const channel = finalGuild.channels.cache.get('1100732254398971934'); // Hardcoded channel ID

                        if (channel) {
                            const roleMention = '<@&1200634196595589220>'; // Role to mention

                            const embed = new EmbedBuilder()
                                .setColor('#00ff00')
                                .setTitle('Happy Birthday!')
                                .setDescription(`Happy birthday to ${mentions.join(', ')}, we hope you have an amazing day!`)
                                .setImage('https://media1.tenor.com/m/-WjS3P-gTSYAAAAC/the-office-it-is-your-birthday.gif');

                            await channel.send({ content: `${mentions.join(', ')} ${roleMention}`, embeds: [embed] });
                        } else {
                            console.error("Channel with ID 1100732254398971934 not found.");
                        }
                    }
                }
            }

            // Schedule the next check for tomorrow's midnight
            scheduleNextCheck();
        } catch (error) {
            console.error("An error occurred while checking birthdays:", error);
            // Retry at the next midnight
            scheduleNextCheck();
        }
    };

    // Start the initial schedule
    scheduleNextCheck();
};

// Function to add ordinal suffixes (st, nd, rd, th) to day numbers
function suffixes(number) {
    const converted = number.toString();
    const lastTwoDigits = number % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
        return `${converted}th`;
    }

    const lastChar = converted.charAt(converted.length - 1);

    return lastChar === "1" ? `${converted}st` :
           lastChar === "2" ? `${converted}nd` :
           lastChar === "3" ? `${converted}rd` : `${converted}th`;
}
