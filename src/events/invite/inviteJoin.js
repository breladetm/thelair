const discord = require('discord.js');

const invites = require("../../database/models/invites");
const invitedBy = require("../../database/models/inviteBy");
const welcomeSchema = require("../../database/models/welcomeChannels");
const messages = require("../../database/models/inviteMessages");
const rewards = require("../../database/models/inviteRewards");

module.exports = async (client, member, invite, inviter) => {
    const messageData = await messages.findOne({ Guild: member.guild.id });
    const customInviteCode = 'thelair69'; // Custom invite code

    if (!invite || !inviter) {
        let joinMessage;

        if (messageData && messageData.inviteJoin) {
            joinMessage = messageData.inviteJoin
                .replace(`{user:username}`, `${member.user.username} (${member.user.id})`)
                .replace(`{user:discriminator}`, member.user.discriminator)
                .replace(`{user:tag}`, member.user.tag)
                .replace(`{user:mention}`, member)
                .replace(`{inviter:username}`, "System")
                .replace(`{inviter:discriminator}`, "#0000")
                .replace(`{inviter:tag}`, "System#0000")
                .replace(`{inviter:mention}`, "System")
                .replace(`{inviter:invites}`, "∞")
                .replace(`{inviter:invites:left}`, "∞")
                .replace(`{guild:name}`, member.guild.name)
                .replace(`{guild:members}`, member.guild.memberCount);

            if (invite && invite.code === customInviteCode) {
                // Custom invite link message
                const customInviteMessage = `**${member.user.username} (${member.user.id})** joined using the custom invite link!`;
                welcomeSchema.findOne({ Guild: member.guild.id }, async (err, channelData) => {
                    if (channelData) {
                        const channel = member.guild.channels.cache.get(channelData.Channel);
                        await client.embed({
                            title: `Custom Invite`,
                            desc: customInviteMessage
                        }, channel).catch(() => { });
                    }
                });
            }
        } else {
            joinMessage = `I cannot trace how ${member.user.username} (\`${member.user.id}\`) joined, they most likely used the vanity url.`;

            welcomeSchema.findOne({ Guild: member.guild.id }, async (err, channelData) => {
                if (channelData) {
                    const channel = member.guild.channels.cache.get(channelData.Channel);
                    client.embed({
                        title: `Invite`,
                        desc: joinMessage
                    }, channel).catch(() => { });
                }
            });
        }

        if (messageData) {
            welcomeSchema.findOne({ Guild: member.guild.id }, async (err, channelData) => {
                if (channelData) {
                    const channel = member.guild.channels.cache.get(channelData.Channel);
                    await client.embed({
                        title: `Invites`,
                        desc: joinMessage
                    }, channel).catch(() => { });
                }
            });
        }
    } else {
        const data = await invites.findOne({ Guild: member.guild.id, User: inviter.id });

        if (data) {
            data.Invites += 1;
            data.Total += 1;
            data.save();

            let joinMessage = messageData ? messageData.inviteJoin : `${member.user.username} (\`${member.user.id}\`) was invited by ${inviter.username} (\`${inviter.id}\`).`;
            
            joinMessage = joinMessage
                .replace(`{user:username}`, `${member.user.username} (${member.user.id})`)
                .replace(`{user:discriminator}`, member.user.discriminator)
                .replace(`{user:tag}`, member.user.tag)
                .replace(`{user:mention}`, member)
                .replace(`{inviter:username}`, inviter.username)
                .replace(`{inviter:discriminator}`, inviter.discriminator)
                .replace(`{inviter:tag}`, inviter.tag)
                .replace(`{inviter:mention}`, inviter)
                .replace(`{inviter:invites}`, data.Invites)
                .replace(`{inviter:invites:left}`, data.Left)
                .replace(`{guild:name}`, member.guild.name)
                .replace(`{guild:members}`, member.guild.memberCount);

            if (invite && invite.code === customInviteCode) {
                // Custom invite link message
                const customInviteMessage = `${member.user.username} (\`${member.user.id}\`) joined using the custom invite link.`;
                welcomeSchema.findOne({ Guild: member.guild.id }, async (err, channelData) => {
                    if (channelData) {
                        const channel = member.guild.channels.cache.get(channelData.Channel);
                        await client.embed({
                            title: `Custom Invite`,
                            desc: customInviteMessage
                        }, channel).catch(() => { });
                    }
                });
            } else {
                welcomeSchema.findOne({ Guild: member.guild.id }, async (err, channelData) => {
                    if (channelData) {
                        const channel = member.guild.channels.cache.get(channelData.Channel);
                        await client.embed({
                            title: `Invites`,
                            desc: joinMessage
                        }, channel).catch(() => { });
                    }
                });
            }

            rewards.findOne({ Guild: member.guild.id, Invites: data.Invites }, async (err, data) => {
                if (data) {
                    try {
                        const role = member.guild.roles.cache.get(data.Role);
                        member.roles.add(role);
                    } catch { }
                }
            });
        } else {
            new invites({
                Guild: member.guild.id,
                User: inviter.id,
                Invites: 1,
                Total: 1,
                Left: 0
            }).save();

            let joinMessage = messageData ? messageData.inviteJoin : `${member.user.username} (\`${member.user.id}\`) was invited by ${inviter.username} (\`${inviter.id}\`).`;
            
            joinMessage = joinMessage
                .replace(`{user:username}`, `${member.user.username} (${member.user.id})`)
                .replace(`{user:discriminator}`, member.user.discriminator)
                .replace(`{user:tag}`, member.user.tag)
                .replace(`{user:mention}`, member)
                .replace(`{inviter:username}`, inviter.username)
                .replace(`{inviter:discriminator}`, inviter.discriminator)
                .replace(`{inviter:tag}`, inviter.tag)
                .replace(`{inviter:mention}`, inviter)
                .replace(`{inviter:invites}`, "1")
                .replace(`{inviter:invites:left}`, "0")
                .replace(`{guild:name}`, member.guild.name)
                .replace(`{guild:members}`, member.guild.memberCount);

            if (invite && invite.code === customInviteCode) {
                // Custom invite link message
                const customInviteMessage = `${member.user.username} (\`${member.user.id}\`) joined using the custom invite link.`;
                welcomeSchema.findOne({ Guild: member.guild.id }, async (err, channelData) => {
                    if (channelData) {
                        const channel = member.guild.channels.cache.get(channelData.Channel);
                        await client.embed({
                            title: `Custom Invite`,
                            desc: customInviteMessage
                        }, channel).catch(() => { });
                    }
                });
            } else {
                welcomeSchema.findOne({ Guild: member.guild.id }, async (err, channelData) => {
                    if (channelData) {
                        const channel = member.guild.channels.cache.get(channelData.Channel);
                        await client.embed({
                            title: `Invites`,
                            desc: joinMessage
                        }, channel).catch(() => { });
                    }
                });
            }
        }

        invitedBy.findOne({ Guild: member.guild.id }, async (err, data2) => {
            if (data2) {
                data2.inviteUser = inviter.id;
                data2.User = member.id;
                data2.save();
            } else {
                new invitedBy({
                    Guild: member.guild.id,
                    inviteUser: inviter.id,
                    User: member.id
                }).save();
            }
        });
    }
};
