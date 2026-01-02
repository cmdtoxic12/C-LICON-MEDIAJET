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
     * API Link: https://rapidapi.com/Lundehund/api/tiktok-api23
     */
    const RAPID_API_KEY = '66f5cf6778mshb00f72e9432debdp1971dfjsn00e4302cc7de'; 
    const RAPID_API_HOST = 'tiktok-api23.p.rapidapi.com';

    try {
        // Fallback for demo purposes if key is missing
        if (RAPID_API_KEY === '66f5cf6778mshb00f72e9432debdp1971dfjsn00e4302cc7de') {
            return res.status(200).json({
                success: true,
                title: "[DEMO] No API Key Found in api/fetch.js",
                author: "@dev_mode",
                thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400",
                video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
                audio_url: "https://www.w3schools.com/html/horse.mp3",
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
        
        const result = await response.json();

        // Mapping tiktok-api23 response structure
        // The API usually returns video info in the root or under a 'video' object
        if (result && result.author) {
            return res.status(200).json({
                success: true,
                title: result.desc || "TikTok Video",
                author: `@${result.author.uniqueId}`,
                thumbnail: result.video.cover,
                // Using the play address which is typically the no-watermark link
                video_url: result.video.playAddr, 
                audio_url: result.music.playUrl,
            });
        } else {
            return res.status(400).json({ 
                error: result.msg || "The video could not be fetched. Check if the URL is correct and public." 
            });
        }

    } catch (error) {
        console.error('API Handler Error:', error);
        res.status(500).json({ error: 'Server error processing the TikTok link.' });
    }
}
