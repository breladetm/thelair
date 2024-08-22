const { CommandInteraction, Client, EmbedBuilder } = require('discord.js');
const { ContextMenuCommandBuilder } = require('discord.js');
const model = require('../../database/models/badge'); // Adjust path as needed

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Bot Roles')
        .setType(2), // Type 2 is for user context menus

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        try {
            await interaction.deferReply({ ephemeral: false });

            const user = interaction.options.getUser('user');
            const member = await interaction.guild.members.fetch(user.id);

            // Fetch the badge data from the database
            let badges = await model.findOne({ User: member.user.id });
            if (!badges) {
                badges = { FLAGS: [] }; // Initialize with an empty array if no badges are found
            }

            const badgeFlags = {
                DEVELOPER: {
                    description: '> Designs and implements the core bot system, integrates technologies and databases, and manages error handling with logging and monitoring tools. Oversees bot performance, optimizes resources, gathers user feedback, ensures user experience, and maintains security and compliance.'
                },
                TEAM: {
                    description: '> Identifies, reproduces, and resolves bugs and issues reported by users. Manages support inquiries, communicates through various channels, and escalates complex issues. Develops FAQs and guides, collects user feedback, and provides proactive support to prevent issues.'
                },
                PARTNER: {
                    description: '> Partners are either official applications or individuals recognized and valued by The Lair bot development team. As a partner, you\'ll gain access to exclusive commands and enjoy a special badge displayed next to your profile.'
                },
                LAIRSTAFF: {
                    displayName: 'Lair Staff',
                    description: '> Staff members for The Lair server are not official staff members for The Lair bot, however as we are partnered, they deserve recognition. Staff members for The Lair server handle moderation tasks, host events, timeout members and more. For more information on each staff member and their position, please read [this](https://discord.com/channels/1100559473518575767/1164660334859124737) message.'
                },
                BUGHUNTER: {
                    description: '> Finds and reports bugs in the system. Provides detailed bug reports and helps in troubleshooting and fixing issues.'
                },
                HOE: {
                    description: '> These people are the server hoes. It’s important to handle interactions with these users cautiously, as they may exhibit challenging behavior.'
                }
            };

            // Define the hierarchy order
            const hierarchy = ['DEVELOPER', 'TEAM', 'PARTNER', 'LAIRSTAFF', 'BUGHUNTER', 'HOE'];

            let embedFields = [];
            const embedColor = '#7F8C6D'; // Set the embed color for all roles

            let numberOfRoles = badges.FLAGS.length; // Get the number of roles

            // Determine the description based on the number of roles
            let embedDescription;
            if (numberOfRoles === 1) {
                embedDescription = `${member.user.username} has **1** bot role. Here’s a quick rundown of what it involves:`;
            } else if (numberOfRoles > 1) {
                embedDescription = `${member.user.username} has **${numberOfRoles}** bot roles. Here’s a quick rundown of what each one involves:`;
            } else {
                embedDescription = `User has no acknowledgements`;
            }

            if (numberOfRoles > 0) {
                // Filter and sort badges according to hierarchy
                const sortedFlags = hierarchy.filter(flag => badges.FLAGS.includes(flag));

                sortedFlags.forEach(flag => {
                    if (badgeFlags[flag]) {
                        const formattedRoleName = badgeFlags[flag].displayName || flag.charAt(0).toUpperCase() + flag.slice(1).toLowerCase(); // Capitalize first letter or use custom display name
                        embedFields.push({
                            name: formattedRoleName, // Formatted role name
                            value: badgeFlags[flag].description // Role description
                        });
                    }
                });
            }

            // Create and send the embed
            const embed = new EmbedBuilder()
                .setDescription(embedDescription)
                .setAuthor({ name: `${member.user.username} (${member.user.id})`, iconURL: `${member.user.displayAvatarURL({ dynamic: true, size: 1024 })}`})
                .addFields(embedFields)
                .setColor(embedColor);

            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error handling bot roles:', error);
            return client.errNormal({
                error: 'An error occurred while processing the staff check.',
                type: 'ephemeral'
            }, interaction);
        }
    },
};
