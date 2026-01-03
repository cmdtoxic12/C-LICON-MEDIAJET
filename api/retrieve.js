const fetch = require('node-fetch');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {  // Frontend sends POST with URL in body
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url: tiktokUrl } = req.body;
    if (!tiktokUrl || !tiktokUrl.includes('tiktok.com')) {
        return res.status(400).json({ error: 'Invalid or missing TikTok URL' });
    }

    const apiKey = process.env.RAPIDAPI_KEY;  // Use your env var (never hardcode!)
    const apiHost = 'tiktok-video-audio-downloader1.p.rapidapi.com';

    try {
        // Encode the TikTok URL and append as ?url=
        const encodedUrl = encodeURIComponent(tiktokUrl);
        const rapidUrl = `https://${apiHost}/?url=${encodedUrl}`;

        const response = await fetch(rapidUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apiHost
            }
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API error ${response.status}: ${errText.substring(0, 200)}`);
        }

        const data = await response.json();

        // Common fields for similar APIs – adjust after your first test response
        const videoLink = data?.video?.no_watermark || data?.hd_video || data?.video_url || data?.download_url || '';
        const audioLink = data?.audio || data?.music_url || data?.mp3 || '';
        const cover = data?.cover || data?.thumbnail || data?.images?.[0] || '';
        const desc = data?.title || data?.description || data?.desc || 'TikTok Video';

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
