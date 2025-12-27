import fetch from "node-fetch";

export default async function handler(req, res) {
  const { platform, url } = req.query;

  const apiRes = await fetch(
    `https://download-all-in-one-lite.p.rapidapi.com/autolink?url=${encodeURIComponent(url)}`,
    {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "download-all-in-one-lite.p.rapidapi.com"
      }
    }
  );

  const data = await apiRes.json();
  const finalLink = data.url || data.result || data.data?.url;

  res.json({ finalLink });
}
