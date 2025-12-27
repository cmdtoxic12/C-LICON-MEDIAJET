export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) return res.status(400).end();

  try {
    const fileRes = await fetch(url);

    res.setHeader("Content-Type", fileRes.headers.get("content-type") || "application/octet-stream");
    res.setHeader("Content-Disposition", "attachment");

    fileRes.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).end("Proxy error");
  }
}
