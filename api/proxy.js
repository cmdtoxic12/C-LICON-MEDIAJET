export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) return res.status(400).end("Missing URL");

  try {
    const fileRes = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                      "(KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9"
      },
      redirect: "follow"
    });

    if (!fileRes.ok) {
      const txt = await fileRes.text();
      console.error("Proxy fetch failed:", fileRes.status, txt);
      return res.status(500).end("Failed to fetch media from source.");
    }

    res.setHeader("Content-Type", fileRes.headers.get("content-type") || "application/octet-stream");
    res.setHeader("Content-Disposition", "attachment");
    fileRes.body.pipe(res);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).end("Proxy error occurred.");
  }
}
