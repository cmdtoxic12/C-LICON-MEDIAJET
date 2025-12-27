export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: "Missing URL" });

  try {
    const apiRes = await fetch(
      `https://download-all-in-one-lite.p.rapidapi.com/autolink?url=${encodeURIComponent(url)}`,
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "download-all-in-one-lite.p.rapidapi.com"
        }
      }
    );

    if (!apiRes.ok) {
      const txt = await apiRes.text();
      console.error("RapidAPI error:", txt);
      return res.status(500).json({ error: "RapidAPI failed" });
    }

    const data = await apiRes.json();
    const finalLink = data.url || data.result || data.data?.url;

    if (!finalLink) return res.status(500).json({ error: "No link in response" });

    res.json({ finalLink });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Resolve crashed" });
  }
}
