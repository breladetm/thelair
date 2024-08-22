const { Client, Intents } = require('discord.js');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: '1c6b2717c74c4599884e36f458f1af15',
    clientSecret: 'dd25ccf0a0c54b42b0867dff194c1961'
});

// You should obtain an access token before using the API
async function authenticateSpotify() {
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body['access_token']);
    } catch (err) {
        console.error('Error getting Spotify access token', err);
    }
}

module.exports = async (client, interaction, args) => {
    // Authenticate Spotify API client
    await authenticateSpotify();

    const song = interaction.options.getString('song');

    try {
        const data = await spotifyApi.searchTracks(`track:${song}`, { limit: 1 });
        const track = data.body.tracks.items[0];

        if (!track) {
            return client.errNormal({ 
                error: "Song not found!",
                type: 'editreply'
            }, interaction);
        }

        // Format the release date to "4 October 2017"
        const releaseDate = new Date(track.album.release_date);
        const formattedDate = releaseDate.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        client.embed({
            title: `${track.name}`,
            thumbnail: track.album.images[0]?.url,
            url: track.external_urls.spotify,
            fields: [
                {
                    name: "Name",
                    value: `${track.name}`,
                    inline: false,
                },
                {
                    name: "Artist",
                    value: `${track.artists.map(artist => artist.name).join(', ')}`,
                    inline: false,
                },
                {
                    name: "Album",
                    value: `${track.album.name}`,
                    inline: false,
                },
                {
                    name: "Length",
                    value: `${Math.floor(track.duration_ms / 60000)}:${Math.floor((track.duration_ms % 60000) / 1000).toString().padStart(2, '0')}`,
                    inline: false,
                },
                {
                    name: "Release Date",
                    value: formattedDate,
                    inline: false,
                },
            ],
            type: 'editreply'
        }, interaction);
    } catch (e) {
        console.error('Error fetching track from Spotify', e);
        client.errNormal({ 
            error: "An error occurred while fetching the song!",
            type: 'editreply'
        }, interaction);
    }
}
