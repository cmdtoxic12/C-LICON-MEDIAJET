const fetch = require('node-fetch'); // Vercel includes this by default, no install needed

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'Missing TikTok URL' });
    }

    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = 'tiktok-api23.p.rapidapi.com';

    try {
        // Extract video ID from URL
        const videoIdMatch = url.match(/\/video\/(\d+)/);
        if (!videoIdMatch) throw new Error('Invalid TikTok URL');

        const videoId = videoIdMatch[1];

        const response = await fetch(`https://\( {apiHost}/post?id= \){videoId}`, {
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

        // IMPORTANT: Adjust these paths based on actual API response!
        // Test in RapidAPI playground and update accordingly.
        // Common fields from similar TikTok APIs:
        // Adjust these based on actual tiktok-api23 response (test in RapidAPI playground!)
        // Common fields from similar TikTok APIs:
        const videoLink = data?.video?.no_watermark || data?.hdplay || data?.data?.video_url || data?.playAddr || '';
        const audioLink = data?.music?.play_url || data?.music?.playUrl || data?.data?.music_url || '';
        const cover = data?.video?.cover || data?.cover || data?.data?.cover || '';
        const desc = data?.desc || data?.text || data?.data?.desc || 'TikTok Video';

        res.status(200).json({ 
            video: videoLink, 
            audio: audioLink,
            cover: cover,
            desc: desc
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Failed to fetch download links' });
    }
};