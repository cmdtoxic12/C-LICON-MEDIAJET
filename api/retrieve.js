export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url } = req.body || {};
  if (!url) return res.status(400).json({ error: "Missing URL" });

  try {
    console.log("Sending request to Cobalt for URL:", url);

    const response = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0" // sometimes helps
      },
      body: JSON.stringify({ url })
    });

    console.log("Cobalt response status:", response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error("Cobalt error response:", text);
      return res.status(502).json({ error: "Upstream retrieval failed", details: text });
    }

    const data = await response.json();
    console.log("Cobalt response data:", data);

    if (!data.url) return res.status(404).json({ error: "No video found" });

    return res.status(200).json({ url: data.url });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}


  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
