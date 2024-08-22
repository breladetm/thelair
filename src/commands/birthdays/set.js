const { EmbedBuilder } = require('discord.js');
const Schema = require("../../database/models/birthday");

module.exports = async (client, interaction, args) => {
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

    const day = interaction.options.getNumber('day');
    const month = interaction.options.getNumber('month');

    if (!day || day < 1 || day > 31) {
        return client.errNormal({
            error: "Wrong day format!",
            type: 'editreply'
        }, interaction);
    }

    if (!month || month < 1 || month > 12) {
        return client.errNormal({
            error: "Wrong month format!",
            type: 'editreply'
        }, interaction);
    }

    const convertedDay = suffixes(day);
    const convertedMonth = months[month];
    const birthdayString = `${convertedDay} of ${convertedMonth}`;

    // Save or update the user's birthday in the database
    const userId = interaction.user.id;
    const username = interaction.user.username;

    const userBirthday = await Schema.findOne({ Guild: interaction.guild.id, UserID: userId });
    if (userBirthday) {
        userBirthday.Birthday = birthdayString;
        userBirthday.Username = username; // Update the username
        await userBirthday.save();
    } else {
        await new Schema({
            Guild: interaction.guild.id,
            Birthday: birthdayString,
            Username: username,
            UserID: userId
        }).save();
    }

    // Send confirmation to the user
    await client.succNormal({
        text: `Your birthday has been set successfully.`,
        fields: [
            {
                name: `Birthday`,
                value: `${birthdayString}`
            }
        ],
        type: 'editreply'
    }, interaction);

    // Check if the newly set birthday matches today's date
    const now = new Date();
    const todayDate = `${now.getDate()} - ${now.getMonth() + 1}`;
    const todayFormatted = `${suffixes(now.getDate())} of ${months[now.getMonth() + 1]}`;

    if (birthdayString === todayFormatted) {
        // Trigger immediate announcement if the birthday matches today
        await announceBirthday(client, interaction.guild.id, todayFormatted);
    }
}

function suffixes(number) {
    // Special cases for 11, 12, and 13
    if (number % 100 >= 11 && number % 100 <= 13) {
        return `${number}th`;
    }

    // General cases
    const lastChar = number.toString().slice(-1);

    return lastChar === "1" ? `${number}st` :
           lastChar === "2" ? `${number}nd` :
           lastChar === "3" ? `${number}rd` : `${number}th`;
}

async function announceBirthday(client, guildId, todayFormatted) {
    const guild = client.guilds.cache.get(guildId);
    if (!guild) return;

    const channel = guild.channels.cache.get('1100732254398971934'); // Hardcoded channel ID

    if (channel) {
        // Find all users with birthdays today
        const results = await Schema.find({ Guild: guildId, Birthday: todayFormatted });

        if (results.length > 0) {
            // Collect user mentions and ensure the role mention is at the end
            const mentions = results.map(result => `<@${result.UserID}>`).join(', ');
            const roleMention = '<@&1200634196595589220>'; // Role to mention

            const embed = new EmbedBuilder()
                .setColor('#7F8C6D')
                .setTitle('Happy Birthday!')
                .setDescription(`Happy birthday to ${mentions}, we hope you have an amazing day!`)
                .setImage('https://media1.tenor.com/m/-WjS3P-gTSYAAAAC/the-office-it-is-your-birthday.gif');

            try {
                await channel.send({ content: `${mentions} ${roleMention}`, embeds: [embed] });
            } catch (error) {
                console.error('Failed to send birthday announcement:', error);
            }
        }
    } else {
        console.error("Channel with ID 1100732254398971934 not found.");
    }
}
