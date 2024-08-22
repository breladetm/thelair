const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    const message = interaction.options.getString('message');

    client.succNormal({
        text: `Message has been sent successfully!`,
        type: 'ephemeraledit'
    }, interaction);

    if (message == "rules") {
        client.embed({
            title: `Rules`,
            thumbnail: client.user.avatarURL({ size: 1024 }),
            desc: `These are our server rules. Please stick to this to keep it fun for everyone. The Admins and Mods will Timeout/Kick/Ban per discretion.`,
            fields: [
                {
                    name: `1. No harassment, bullying, slurs or aggressive behavior.`,
                    value: `No harassment, bullying, slurs or aggressive behavior. No poaching (of members, ideas, server content, etc) or violating game channel rules. There is a zero-tolerance policy for racist, sexist, homophobic, or otherwise prejudiced comments, including disrespectful remarks towards race/religion/political beliefs.`,
                },
                {
                    name: `2. No pornographic/adult/other NSFW material.`,
                    value: `The idea behind the server is to provide a safe place for us to share art, videos, and other kinds of creative material – not to share the aforementioned NSFW material. Save it for NSFW channels!`,
                },
                {
                    name: `3. Respect others’ privacy.`,
                    value: `Do not invade the privacy of other users by asking for or sharing their personal information, such as real names, addresses, or social media accounts without their consent. The admin team also has a right to verify anyone’s identity for server safety.`,
                },
                {
                    name: `4. No mean girl/boy behavior, & no pettiness!`,
                    value: `If you have a problem, DM them. Or start a group DM with ren and I. We have support tickets too.`,
                },
                {
                    name: `5. We will not tolerate threats.`,
                    value: `If you message any of the admin team or we see it elsewhere, it will be handled appropriately depending on the severity of the threat. If you don’t want to be placed on timeout/kick/ban status, don’t play with us.`,
                },
                {
                    name: `6. No slandering of members in or out of the server.`,
                    value: `If we see (we will need proof or witness it as an admin team), you will be brought to group DM for discussion which will lead to appropriate measures. This includes screenshots of conversations within the server.`,
                },
                {
                    name: `7. The admin team has the right to remove anyone who they do not feel is a good fit for the server.`,
                    value: `This includes multiple infractions with the same person/persons.`,
                },
                {
                    name: `8. Presence`,
                    value: `We are not a revolving door. Don’t continually leave and rejoin, you may not be accepted back! Additionally, you will be removed from snap/Plato/outside DC apps if you leave/are removed from the server.`,
                },
                {
                    name: `9. Extra`,
                    value: `If <@957798219461574676> ever leaves me, I will burn the server to the ground immediately 🤠`,
                },
                {
                    name: `\u200B`,
                    value: `**If you ain't got a Krusty Kooch, you ain't Welcum**`,
                }
            ]
        }, interaction.channel);
    }

    if (message == "boosterperks") {
        client.embed({
            title: `Booster Perks`,
            thumbnail: client.user.avatarURL({ size: 1024 }),
            fields: [
                {
                    name: `WIP`,
                    value: `WIP`,
                }
            ]
        }, interaction.channel);
    }
};
