// Vercel Serverless Function
// Path: api/fetch.js

export default async function handler(req, res) {
    // Add CORS headers for Vercel
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Here you would integrate a real TikTok API.
        // For a real production app on Vercel, I recommend using a RapidAPI TikTok endpoint
        // as serverless functions have execution limits (10-60s) and can't run large binaries easily.

        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate work

        res.status(200).json({
            success: true,
            title: "Vercel Hosted TikTok Downloader Preview",
            author: "@digital_creator",
            thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400",
            video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
            audio_url: "https://www.w3schools.com/html/horse.mp3",
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
