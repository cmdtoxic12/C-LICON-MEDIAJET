export default async function handler(req, res) {
  if(req.method !== "POST") return res.status(405).json({ error:"Method not allowed" });

  const { url, format, resolution } = req.body || {};
  if(!url) return res.status(400).json({ error:"Missing URL" });

  try {
    // Call a real video extraction API here
    const response = await fetch("https://api.cobalt.tools/api/json", {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Accept":"application/json",
        "User-Agent":"Mozilla/5.0"
      },
      body: JSON.stringify({ url, format, resolution })
    });

    if(!response.ok){
      const text = await response.text();
      console.error("Upstream failed:", response.status, text);
      return res.status(502).json({ error:"Upstream failed", status:response.status });
    }

    const data = await response.json();
    if(!data.url) return res.status(404).json({ error:"No video found" });

    res.status(200).json({ url: data.url });
  }catch(err){
    console.error(err);
    res.status(500).json({ error:"Server error" });
  }
}
