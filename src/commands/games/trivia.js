const Discord = require('discord.js');
const fetch = require('node-fetch');
const { decode } = require('html-entities');

// Utility functions
const getRandomString = (length) => {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () => randomChars.charAt(Math.floor(Math.random() * randomChars.length))).join('');
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const convertTime = (time) => {
    const units = [
        { label: 'days', value: Math.floor(time / (1000 * 60 * 60 * 24)) },
        { label: 'hours', value: Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) },
        { label: 'minutes', value: Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)) },
        { label: 'seconds', value: Math.floor((time % (1000 * 60)) / 1000) }
    ];

    return units
        .filter(unit => unit.value > 0)
        .map(unit => `${unit.value} ${unit.label}`)
        .join(', ');
};

// Main function
module.exports = async (client, interaction) => {
    const totalQuestions = 10;
    const userScores = new Map();
    let questionIndex = 0;

    const askQuestion = async () => {
        if (questionIndex >= totalQuestions) {
            return showFinalScores();
        }

        const ids = Array.from({ length: 4 }, () => `${getRandomString(20)}-${getRandomString(20)}-${getRandomString(20)}-${getRandomString(20)}`);
        
        const question = await fetch('https://opentdb.com/api.php?amount=1&type=multiple&difficulty=hard')
            .then(res => res.json())
            .then(data => {
                const result = data.results[0];
                const options = shuffleArray([...result.incorrect_answers, result.correct_answer]);
                return {
                    question: result.question,
                    difficulty: result.difficulty,
                    correct: options.indexOf(result.correct_answer),
                    options
                };
            });

        const winningID = ids[question.correct]; // Set the first correct answer as the winning answer

        // Create buttons
        const buttons = ids.map((id, index) => new Discord.ButtonBuilder()
            .setStyle(Discord.ButtonStyle.Primary)
            .setLabel(`${index + 1}️⃣`)
            .setCustomId(id));

        const row = new Discord.ActionRowBuilder().addComponents(buttons);

        // Prepare question text
        const optionsText = question.options.map((opt, index) => `**${index + 1})** ${decode(opt)}`).join('\n');

        // Send the question
        await client.embed({
            title: `Trivia`,
            fields: [{ name: decode(question.question), value: `You only have **${convertTime(60000)}** to guess the answer!\n\n${optionsText}` }],
            components: [row],
            type: 'editreply'
        }, interaction).then(async (message) => {
            const gameCreatedAt = Date.now();

            const collector = interaction.channel.createMessageComponentCollector({
                componentType: Discord.ComponentType.Button,
                time: 60000
            });

            collector.on('collect', async (trivia) => {
                if (!userScores.has(trivia.user.id)) {
                    userScores.set(trivia.user.id, 0);
                }

                trivia.deferUpdate();
                collector.stop();

                const styles = ids.map((id) => id === winningID
                    ? Discord.ButtonStyle.Success
                    : trivia.customId === id
                        ? Discord.ButtonStyle.Danger
                        : Discord.ButtonStyle.Secondary
                );

                const updatedButtons = buttons.map((btn, index) => btn.setStyle(styles[index]).setDisabled(true));

                const isCorrect = trivia.customId === winningID;
                const resultText = isCorrect
                    ? `${trivia.user} answered correctly! The next question will be in around 10 seconds.`
                    : `${trivia.user} answered incorrectly. The next question will be in around 10 seconds. The correct answer was **${question.options[question.correct]}**.`;

                if (isCorrect) {
                    userScores.set(trivia.user.id, userScores.get(trivia.user.id) + 1);
                }

                await client.embed({
                    title: `Trivia`,
                    desc: resultText,
                    components: [{ type: 1, components: updatedButtons }],
                    type: 'editreply'
                }, interaction);

                questionIndex++;
                setTimeout(askQuestion, 10000); // Wait 10 seconds before asking the next question
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    const timeoutButtons = buttons.map((btn, index) => btn.setStyle(ids[index] === winningID ? Discord.ButtonStyle.Success : Discord.ButtonStyle.Secondary).setDisabled(true));
                    
                    client.embed({
                        title: `Trivia`,
                        desc: `Time's up! The correct answer was **${question.options[question.correct]}**. The next question will be in around 10 seconds.`,
                        components: [{ type: 1, components: timeoutButtons }],
                        type: 'editreply'
                    }, interaction);

                    questionIndex++;
                    setTimeout(askQuestion, 10000); // Wait 10 seconds before asking the next question
                }
            });
        });
    };

    const showFinalScores = async () => {
        const sortedScores = Array.from(userScores.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([userId, score]) => `<@${userId}>: ${score} points`);

        await client.embed({
            title: `Trivia Ended`,
            desc: `Here are the final scores!\n\n${sortedScores.join('\n')}`,
            type: 'editreply'
        }, interaction);
    };

    // Start the trivia
    await askQuestion();
};
