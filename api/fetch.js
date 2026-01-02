// Vercel Serverless Function using tiktok-api23 via RapidAPI
// Path: api/fetch.js

export default async function handler(req, res) {
    // CORS Headers for Vercel
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.body;

    if (!url || !url.includes('tiktok.com')) {
        return res.status(400).json({ error: 'Please provide a valid TikTok link.' });
    }

    /**
     * TIKTOK-API23 via RapidAPI
     * IMPORTANT: Replace the string below with your actual key from RapidAPI.
     * If you are getting a 500 error, check your Vercel logs to see if the key is missing.
     */
    const RAPID_API_KEY = '66f5cf6778mshb00f72e9432debdp1971dfjsn00e4302cc7de'; 
    const RAPID_API_HOST = 'tiktok-api23.p.rapidapi.com';

    try {
        // Validation to prevent 500 error if key is still placeholder
        if (RAPID_API_KEY === '66f5cf6778mshb00f72e9432debdp1971dfjsn00e4302cc7de') {
            return res.status(400).json({ 
                error: 'Backend Configuration Error: RAPID_API_KEY is still the placeholder. Please update api/fetch.js with your real key.' 
            });
        }

        const apiUrl = `https://${RAPID_API_HOST}/api/video/info?url=${encodeURIComponent(url)}`;
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': RAPID_API_HOST
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ 
                error: `RapidAPI responded with ${response.status}: ${errorText}` 
            });
        }
        
        const result = await response.json();

        // Robust parsing for tiktok-api23 structure
        // The API might return { data: {...} } or the object directly
        const data = result.data || result;

        if (data && (data.video || data.author || data.aweme_id)) {
            // Mapping with fallbacks to prevent undefined property errors
            const videoUrl = data.video?.playAddr || data.video?.play_addr?.url_list?.[0] || data.video?.download_addr;
            const audioUrl = data.music?.playUrl || data.music?.play_url?.url_list?.[0];
            const thumbnail = data.video?.cover || data.video?.origin_cover || data.video?.cover?.url_list?.[0];
            const authorName = data.author?.uniqueId || data.author?.nickname || "tiktok_user";

            return res.status(200).json({
                success: true,
                title: data.desc || data.title || "TikTok Video",
                author: `@${authorName}`,
                thumbnail: thumbnail || "",
                video_url: videoUrl, 
                audio_url: audioUrl,
            });
        } else {
            return res.status(400).json({ 
                error: result.message || "The API returned an unexpected format. The video might be restricted or private." 
            });
        }

    } catch (error) {
        console.error('Fetch Error:', error.message);
        res.status(500).json({ 
            error: 'Internal Server Error',
            details: error.message 
        });
    }
}
