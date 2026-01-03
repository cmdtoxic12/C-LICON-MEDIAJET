const fetch = require('node-fetch');

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed - use GET' });
    }

    const { id } = req.query;  // Get videoId from ?id=...
    if (!id) {
        return res.status(400).json({ error: 'Missing id parameter' });
    }

    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = 'tiktok-api23.p.rapidapi.com';

    try {
        // CHANGE THIS PATH TO THE CORRECT ONE FOR SINGLE POST
        // Common possibilities based on similar APIs:
        // /post ?id=...
        // /video ?id=...
        // /api/post/detail ?id=...
        // Test in RapidAPI playground to confirm!
        const rapidUrl = `https://\( {apiHost}/post?id= \){id}`;  // Adjust if different, e.g., /video/detail or /aweme/detail

        const response = await fetch(rapidUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apiHost
            }
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API error: ${response.status} - ${errText}`);
        }

        const data = await response.json();

        // Extract fields (update based on real response)
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
        console.error(error);
        res.status(500).json({ error: error.message || 'Failed to fetch media' });
    }
};
