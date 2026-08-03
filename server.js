const express = require('express');
const YouTube = require('youtube-sr').default;
const app = express();
const PORT = 3000;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index');
});

// youtube type shii
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "No query provided" });

    try {
        const searchQuery = `${query} audio lyrics`;
        const results = await YouTube.search(searchQuery, { limit: 8, type: 'video' });

        const tracks = results.map(video => ({
            id: video.id,
            title: video.title || 'Unknown Title',
            artist: video.channel ? video.channel.name : 'YouTube Artist',
            cover: video.thumbnail ? video.thumbnail.url : 'https://picsum.photos/200'
        }));

        res.json(tracks);
    } catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ error: "Search failed" });
    }
});

app.listen(PORT, () => {
    console.log(`🎧 Tubify running seamlessly at http://localhost:${PORT} by Mudrankjk`);
});

console.log("Mudrankjk is the G.O.A.T.");