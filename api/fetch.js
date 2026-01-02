// Finalized TikTok Downloader Serverless API for Vercel
// Path: api/fetch.js

export default async function handler(req, res) {
    // Standard CORS configuration
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
     * TIKWM API via RapidAPI
     * Get your key: https://rapidapi.com/tikwm-tikwm-default/api/tiktok-downloader-download-tiktok-videos-without-watermark
     * Paste your key below:
     */
    const RAPID_API_KEY = 'YOUR_RAPID_API_KEY_HERE'; 
    const RAPID_API_HOST = 'tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com';

    try {
        // Fallback for demo purposes if key is missing
        if (RAPID_API_KEY === 'YOUR_RAPID_API_KEY_HERE') {
            return res.status(200).json({
                success: true,
                title: "Example: Nature is beautiful 🌿 #foryou",
                author: "@travel_demo",
                thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
                video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
                audio_url: "https://www.w3schools.com/html/horse.mp3",
            });
        }

        const apiUrl = `https://${RAPID_API_HOST}/vid/index?url=${encodeURIComponent(url)}`;
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': RAPID_API_HOST
            }
        });
        
        const result = await response.json();

        if (result.code === 0 && result.data) {
            return res.status(200).json({
                success: true,
                title: result.data.title || "TikTok Video",
                author: `@${result.data.author.unique_id}`,
                thumbnail: result.data.cover,
                video_url: result.data.play,
                audio_url: result.data.music,
            });
        } else {
            return res.status(400).json({ error: result.msg || "The video is private, deleted, or region-locked." });
        }

    } catch (error) {
        console.error('API Handler Error:', error);
        res.status(500).json({ error: 'Server error processing the TikTok link.' });
    }
}
