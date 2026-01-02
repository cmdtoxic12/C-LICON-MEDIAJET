export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url } = req.body || {};
  if (!url) return res.status(400).json({ error: "Missing URL" });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify({ url }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
  const text = await response.text();
  console.error("Upstream status:", response.status);
  console.error("Upstream body:", text);

  return res.status(502).json({
    error: "Upstream failed",
    status: response.status,
    details: text.slice(0, 500)
  });
}

    const data = await response.json();

    if (!data.url) return res.status(404).json({ error: "No downloadable video found" });

    return res.status(200).json({ url: data.url });

  } catch (err) {
    if (err.name === "AbortError") {
      return res.status(504).json({ error: "Upstream timeout" });
    }
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
