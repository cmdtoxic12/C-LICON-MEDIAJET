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
    // IMPORTANT: Replace the string below with your actual key from RapidAPI
    const RAPID_API_KEY = '66f5cf6778mshb00f72e9432debdp1971dfjsn00e4302cc7de'; 
    const RAPID_API_HOST = 'tiktok-api23.p.rapidapi.com';

        const apiUrl = `https://${RAPID_API_HOST}/api/video/info?url=${encodeURIComponent(url)}`;
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': RAPID_API_HOST
            }
        });
        
        const result = await response.json();

        // Debug log for Vercel console
        console.log('API Result:', JSON.stringify(result).substring(0, 200));

        // Mapping tiktok-api23 response structure
        // This API returns a specific structure; we check for the existence of the video data
        if (result && (result.author || result.video)) {
            return res.status(200).json({
                success: true,
                title: result.desc || "TikTok Video",
                author: result.author ? `@${result.author.uniqueId}` : "@user",
                thumbnail: result.video ? result.video.cover : "",
                // Using playAddr (No Watermark) and music playUrl
                video_url: result.video ? result.video.playAddr : null, 
                audio_url: result.music ? result.music.playUrl : null,
            });
        } else {
            // Handle cases where the API returns an error message or different structure
            return res.status(400).json({ 
                error: result.message || result.msg || "The API could not find this video. It might be private or the link is expired." 
            });
        }

    } catch (error) {
        console.error('API Handler Error:', error);
        res.status(500).json({ error: 'Server error processing the TikTok link. Check your API key and quota.' });
    }
}
