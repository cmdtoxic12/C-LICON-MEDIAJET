export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body || {};

  if (!url) {
    return res.status(400).json({ error: "Missing URL" });
  }

  try {
    const response = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      return res.status(502).json({ error: "Upstream retrieval failed" });
    }

    const data = await response.json();

    if (!data.url) {
      return res.status(404).json({ error: "No video found" });
    }

    return res.status(200).json({ url: data.url });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
