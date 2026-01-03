const fetch = require('node-fetch');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed - use POST' });
    }

    const { url: tiktokUrl } = req.body;
    if (!tiktokUrl || !tiktokUrl.includes('tiktok.com')) {
        return res.status(400).json({ error: 'Invalid or missing TikTok URL' });
    }

    const apiKey = process.env.RAPIDAPI_KEY;  // Set this in Vercel env vars!
    const apiHost = 'tiktok-download-video-no-watermark.p.rapidapi.com';  // New host

    try {
        // Correct endpoint for this API: /fetch (accepts full URL)
        const rapidUrl = `https://${apiHost}/fetch`;

        const response = await fetch(rapidUrl, {
            method: 'POST',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apiHost,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: tiktokUrl })  // Send full URL in JSON body
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API error ${response.status}: ${errText.substring(0, 200)}`);
        }

        const data = await response.json();

        // Field extraction for GoDownloader API (tested pattern)
        const videoLink = data?.video?.noWatermark || data?.video?.url || '';
        const audioLink = data?.music?.url || data?.audio?.url || '';
        const cover = data?.cover || data?.thumbnail || data?.video?.cover || '';
        const desc = data?.description || data?.title || 'TikTok Video';

        res.status(200).json({
            video: videoLink,
            audio: audioLink,
            cover: cover,
            desc: desc
        });

    } catch (error) {
        console.error('Backend error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch media' });
    }
};
