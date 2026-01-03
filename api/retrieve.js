const fetch = require('node-fetch');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {  // Changed to POST to match the API
        return res.status(405).json({ error: 'Method not allowed - use POST' });
    }

    const { url: tiktokUrl } = req.body;  // Expect full TikTok URL in body
    if (!tiktokUrl) {
        return res.status(400).json({ error: 'Missing TikTok URL in body' });
    }

    const apiKey = process.env.RAPIDAPI_KEY;  // NEVER hardcode your key!
    const apiHost = 'tiktok-video-no-watermark2.p.rapidapi.com';

    try {
        // Try common endpoints – start with /video (most likely for single video)
        // Alternatives: '/item/detail', '/video/detail', '/download'
        const rapidUrl = `https://${apiHost}/video`;  // Adjust if playground shows different

        const response = await fetch(rapidUrl, {
            method: 'POST',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apiHost,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                url: tiktokUrl  // Key param: full TikTok video URL
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API error ${response.status}: ${errText.substring(0, 200)}`);
        }

        const data = await response.json();

        // Common response fields for this API family (adjust after testing)
        const videoLink = data?.data?.play || data?.data?.hdplay || data?.no_watermark || data?.video_url || '';
        const audioLink = data?.data?.music || data?.music_url || data?.data?.music_info?.play || '';
        const cover = data?.data?.cover || data?.cover || data?.origin_cover || '';
        const desc = data?.data?.title || data?.desc || data?.data?.desc || 'TikTok Video';

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
