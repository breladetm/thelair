const Discord = require('discord.js');
const ms = require('ms');

const timeLength = 50000; // Time for typing challenge in milliseconds
const inGame = new Set(); // Track users currently in the game

module.exports = async (client, interaction, args) => {
    // List of sentences to type
    const sentences = [
        "Because we were lost, we had to go back the way we came.",
        "He's in a boy band which doesn't make much sense for a snake.",
        "A dead duck doesn't fly backward.",
        "Don't piss in my garden and tell me you're trying to help my plants grow.",
        "Her scream silenced the rowdy teenagers.",
        "The team members were hard to tell apart since they all wore their hair in a ponytail.",
        "I hear that Nancy is very pretty.",
        "Nudist colonies shun fig-leaf couture.",
        "A song can make or ruin a person’s day if they let it get to them.",
        "She saw no irony asking me to change but wanting me to accept her for who she is.",
        "My uncle's favorite pastime was building cars out of noodles.",
        "In the end, he realized he could see sound and hear words.",
        "Please look up a recipe for chicken soup on the internet.",
        "It didn't take long for Gary to detect the robbers were amateurs.",
        "How did you get hurt?",
        "It was obvious she was hot, sweaty, and tired.",
        "He appeared to be confusingly perplexed.",
        "Love is not like pizza.",
        "It was always dangerous to drive with him since he insisted the safety cones were a slalom course.",
        "As he waited for the shower to warm, he noticed that he could hear water change temperature.",
        "Greetings from the galaxy MACS0647-JD, or what we call home.",
        "The world has changed a lot during the last ten years.",
        "As he entered the church he could hear the soft voice of someone whispering into a cell phone.",
        "Now I need to ponder my existence and ask myself if I'm truly real.",
        "Yesterday's weather was good for climbing.",
        "Waffles are always better without fire ants and fleas.",
        "Nancy was proud that she ran a tight shipwreck.",
        "He was so preoccupied with whether or not he could that he failed to stop to consider if he should.",
        "If eating three-egg omelets causes weight-gain, budgie eggs are a good substitute.",
        "I don’t respect anybody who can’t tell the difference between Pepsi and Coke.",
        "He found the end of the rainbow and was surprised at what he found there.",
        "He wondered why at 18 he was old enough to go to war, but not old enough to buy cigarettes.",
        "She lived on Monkey Jungle Road and that seemed to explain all of her strangeness.",
        "Julie wants a perfect husband.",
        "Can I get you something to drink?",
        "Please wait outside of the house.",
        "His son quipped that power bars were nothing more than adult candy bars.",
        "My older sister looks like my mom.",
        "The thick foliage and intertwined vines made the hike nearly impossible.",
        "A glittering gem is not enough.",
        "Thirty years later, she still thought it was okay to put the toilet paper roll under rather than over.",
        "Each person who knows you has a different perception of who you are.",
        "Go down the stairs carefully.",
        "Facing his greatest fear, he ate his first marshmallow.",
        "She cried diamonds.",
        "Tomorrow will bring something new, so leave today as a memory.",
        "Erin accidentally created a new universe.",
        "David subscribes to the 'stuff your tent into the bag' strategy over nicely folding it.",
        "The waitress was not amused when he ordered green eggs and ham.",
        "All you need to do is pick up the pen and begin."
    ];

    // Function to start the typing game
    async function startTypingGame() {
        if (inGame.has(interaction.user.id)) return; // Check if user is already in game
        inGame.add(interaction.user.id); // Add user to the game

        for (let i = 0; i < 25; i++) {
            const startTime = Date.now();
            const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
            const formattedSentence = formatSentence(randomSentence);

            await client.embed({
                title: `Typing Test`,
                desc: `Type the following sentence in ${ms(timeLength, { long: true })}:\n${formattedSentence}`,
                type: 'editreply'
            }, interaction);

            try {
                const msg = await interaction.channel.awaitMessages({
                    filter: m => m.author.id === interaction.user.id,
                    max: 1,
                    time: timeLength,
                    errors: ['time']
                });

                const userInput = msg.first().content.toLowerCase().trim();
                if (['cancel', 'end'].includes(userInput)) {
                    msg.first().delete();
                    await client.succNormal({ text: "Game ended!", type: 'editreply' }, interaction);
                    break;
                }

                if (userInput === randomSentence.toLowerCase().trim()) {
                    msg.first().delete();
                    await client.succNormal({
                        text: `You typed the word correctly in ${ms(Date.now() - startTime, { long: true })}!`,
                        type: 'editreply'
                    }, interaction);
                    break;
                } else {
                    await client.errNormal({ error: "Sorry, that wasn't correct. Try again.", type: 'editreply' }, interaction);
                    break;
                }
            } catch (error) {
                await client.errNormal({ error: "Time's up, try again!", type: 'editreply' }, interaction);
                break;
            }
        }
        inGame.delete(interaction.user.id); // Remove user from game
    }

    // Function to format sentence for typing game
    function formatSentence(sentence) {
        return sentence.split(' ')
            .map(word => '`' + word.split('').join(' ') + '`')
            .join(' ');
    }

    startTypingGame();
}
