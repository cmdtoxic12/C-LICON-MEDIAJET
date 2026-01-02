import ytdl from "ytdl-core";
import TikTokScraper from "tiktok-scraper";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url, format, resolution } = req.body || {};
  if (!url) return res.status(400).json({ error: "Missing URL" });

  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    
    let videoUrl;

    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
      // YouTube
      const info = await ytdl.getInfo(url);
      const formatOption = info.formats.find(f => f.qualityLabel === resolution && f.container === "mp4") 
                        || info.formats.find(f => f.container === "mp4");
      videoUrl = formatOption?.url;
      if (!videoUrl) throw new Error("No suitable YouTube format found");

    } else if (hostname.includes("tiktok.com")) {
      // TikTok
      const posts = await TikTokScraper.getVideoMeta(url, { noWaterMark: true });
      videoUrl = posts.videoUrl;
      if (!videoUrl) throw new Error("Could not retrieve TikTok video");

    } else {
      return res.status(400).json({ error: "Unsupported platform" });
    }

    res.status(200).json({ url: videoUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
}
