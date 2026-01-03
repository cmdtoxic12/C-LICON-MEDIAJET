const fetch = require('node-fetch');

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed - use GET' });
    }

    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: 'Missing id parameter' });
    }

    const apiKey = process.env.RAPIDAPI_KEY;  // Use env var – never hardcode!
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    const apiHost = 'tiktok-api23.p.rapidapi.com';

    try {
        // Correct endpoint for single post (confirmed by API naming: "Post")
        const rapidUrl = `https://${apiHost}/post?id=${id}`;

        const response = await fetch(rapidUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apiHost
            }
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`RapidAPI error ${response.status}: ${errText.substring(0, 200)}`);
        }

        const data = await response.json();

        // Adjust these paths after testing one real response in RapidAPI playground
        const videoLink = data?.video?.no_watermark || data?.hdplay || data?.playAddr || data?.downloadAddr || '';
        const audioLink = data?.music?.play_url || data?.music?.playUrl || '';
        const cover = data?.video?.cover || data?.cover || data?.originCover || '';
        const desc = data?.desc || data?.text || 'TikTok Video';

        res.status(200).json({
            video: videoLink,
            audio: audioLink,
            cover: cover,
            desc: desc
        });

    } catch (error) {
        console.error('Backend error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch from TikTok API' });
    }
};
