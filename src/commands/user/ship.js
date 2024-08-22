const { createCanvas, loadImage } = require('canvas');
const fetch = require('node-fetch');
const sharp = require('sharp');

module.exports = async (client, interaction, args) => {
    const user1 = interaction.options.getUser('user');
    const user2 = interaction.options.getUser('user2') || interaction.user;  // Use the command user if user2 is not provided

    if (user1.id === user2.id) return client.errNormal({ error: "Please input different users.", type: 'editreply' }, interaction);

    const specialUserIds = ['1086281889716912259', '994399738503901275'];

    let result;

    // Check if user1 or user2 is the specific user
    if (user1.id === '564204167799767052' || user2.id === '564204167799767052') {
        // Set result to a random number between 0 and 20
        result = Math.floor(Math.random() * 21);
    } else {
        result = specialUserIds.includes(user1.id) && specialUserIds.includes(user2.id) ||
                 (user1.id === '1086281889716912259' && user2.id === '994399738503901275') ||
                 (user1.id === '994399738503901275' && user2.id === '1086281889716912259')
                 ? 100
                 : Math.ceil(Math.random() * 100);
    }

    // Determine the title and description based on the result percentage
    let title, description;
    
    if (result <= 30) {
        title = ':broken_heart:';
        const descriptions = ["you can do better", "ehh, better off as friends", "wow...", "lol yikes", "they think you're ugly"];
        description = descriptions[Math.floor(Math.random() * descriptions.length)];
    } else if (result <= 50) {
        title = ':heart:';
        const descriptions = [
            "**getting there.. kinda**", 
            "**Disappointing, I know. You need to lower your standards just a little more.**", 
            "**If only your IQ were that high..**", 
            ":eyes: :fire:", 
            "**Duh!**"
        ];
        description = descriptions[Math.floor(Math.random() * descriptions.length)];
    } else if (result <= 70) {
        title = '<a:aheartbeat:1272995097444749393>';
        const descriptions = [
            "**love is in the air**", 
            "**hubba hubba**", 
            "**zoo wee mama**", 
            "**Not bad for an average bish like you!**", 
            "**This is as good as you'll get.**"
        ];
        description = descriptions[Math.floor(Math.random() * descriptions.length)];
    } else {
        title = ':heart_eyes:';
        const descriptions = [
            "**true love <3**", 
            "**uhh i think this broke my coding**", 
            "**when is the wedding?**", 
            "**Riiiight. No call a developer I think I glitched.**", 
            "**Damn you got a lot of money don't you.**", 
            "**Want a tissue?**"
        ];
        description = descriptions[Math.floor(Math.random() * descriptions.length)];
    }

    async function fetchImage(url) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch image');
            return res.buffer();
        } catch (error) {
            throw error;
        }
    }

    async function processImage(buffer) {
        try {
            const image = sharp(buffer);
            const { data } = await image
                .resize(256, 256) // Resize avatars to 256x256 pixels
                .toFormat('png')
                .toBuffer({ resolveWithObject: true });

            return data;
        } catch (error) {
            throw error;
        }
    }

    async function createLoveMeterImage(user1, user2, result) {
        const canvasHeight = 242;
        const avatarSize = 242;
        const barWidth = 60;
        const canvasWidth = avatarSize * 2 + barWidth;
    
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');
        
        // Clear canvas with transparency
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
        try {
            // Fetch and process avatars
            const [avatar1Buffer, avatar2Buffer] = await Promise.all([
                fetchImage(user1.displayAvatarURL({ format: 'png', size: 256 })),
                fetchImage(user2.displayAvatarURL({ format: 'png', size: 256 }))
            ]);
    
            const [avatar1Data, avatar2Data] = await Promise.all([
                processImage(avatar1Buffer),
                processImage(avatar2Buffer)
            ]);
    
            const [avatar1, avatar2] = await Promise.all([
                loadImage(avatar1Data),
                loadImage(avatar2Data)
            ]);
    
            // Draw avatars directly adjacent to the pink bar
            ctx.drawImage(avatar1, 0, 0, avatarSize, avatarSize);
            ctx.drawImage(avatar2, canvasWidth - avatarSize, 0, avatarSize, avatarSize);
    
            // Draw the vertical pink bar in the middle, filling from the bottom according to result
            const barHeight = canvasHeight * (result / 100);
            ctx.fillStyle = '#FF005C';
            ctx.fillRect(avatarSize, canvasHeight - barHeight, barWidth, barHeight);
    
            // Fixed font size to ensure the text fits within the bar width
            const fontSize = 24; // Fixed size, adjust as needed
    
            // Apply the fixed font size
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillStyle = '#FFFFFF';
    
            // Calculate the position of the text to be vertically and horizontally centered within the filled bar
            const textXPosition = avatarSize + barWidth / 2;
            const textYPosition = canvasHeight - (barHeight / 2) - (fontSize / 2); // Center text vertically within the bar
    
            // Draw the percentage text within the pink bar
            ctx.fillText(`${result}%`, textXPosition, textYPosition);
    
            return canvas.toBuffer('image/png');
        } catch (error) {
            throw error;
        }
    }

    try {
        const imageBuffer = await createLoveMeterImage(user1, user2, result);

        await interaction.editReply({
            content: `${user1} ${user2}`,
            embeds: [
                {
                    title: `${title} Shipped ${user1.username} & ${user2.username}`,
                    description: description,
                    color: 0x7F8C6D,  // Embed color in hexadecimal format
                    image: {
                        url: 'attachment://lovemeter.png'
                    }
                }
            ],
            files: [{ attachment: imageBuffer, name: 'lovemeter.png' }]
        });
    } catch (error) {
        await interaction.editReply({
            content: "There was an error generating the love meter image."
        });
    }
};
