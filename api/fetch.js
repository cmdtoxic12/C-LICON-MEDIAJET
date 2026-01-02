// Finalized Vercel Serverless Function for tiktok-api23
// Path: api/fetch.js

export default async function handler(req, res) {
    // 1. Set CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

    // 2. Handle Preflight
    if (req.method === 'OPTIONS') return res.status(200).end();

    // 3. Method Validation
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { url } = req.body;
    if (!url || !url.includes('tiktok.com')) {
        return res.status(400).json({ error: 'Please provide a valid TikTok link.' });
    }

    // 4. API Configuration
    // Replace the placeholder below with your actual RapidAPI Key
    const RAPID_API_KEY = '66f5cf6778mshb00f72e9432debdp1971dfjsn00e4302cc7de'; 
    const RAPID_API_HOST = 'tiktok-api23.p.rapidapi.com';

    try {
        // Guard against placeholder key to prevent confusing 500 errors
        if (!RAPID_API_KEY || RAPID_API_KEY === '66f5cf6778mshb00f72e9432debdp1971dfjsn00e4302cc7de') {
            return res.status(400).json({ 
                error: 'Config Error: Please add your real RapidAPI key to api/fetch.js' 
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

        // Check if API is up
        if (!response.ok) {
            const errBody = await response.text();
            return res.status(response.status).json({ error: `API Provider Error: ${response.status}`, details: errBody });
        }
        
        const result = await response.json();

        // 5. Robust Data Mapping for tiktok-api23
        // This API returns the video object either at the root or inside a .data property
        const d = result.data || result;

        if (d && (d.video || d.aweme_id)) {
            // Priority Mapping: No Watermark (playAddr) > Download Link > Music
            const responseData = {
                success: true,
                title: d.desc || d.title || "TikTok Video",
                author: d.author ? `@${d.author.uniqueId || d.author.nickname}` : "@user",
                thumbnail: d.video?.cover || d.video?.origin_cover || "",
                video_url: d.video?.playAddr || d.video?.play_addr?.url_list?.[0] || d.video?.download_addr,
                audio_url: d.music?.playUrl || d.music?.play_url?.url_list?.[0] || d.music?.play_url
            };

            return res.status(200).json(responseData);
        } else {
            return res.status(404).json({ error: result.message || "No video data found for this link." });
        }

    } catch (error) {
        console.error('Fetch Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
