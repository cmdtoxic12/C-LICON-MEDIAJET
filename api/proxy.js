import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).end();

  const fileRes = await fetch(url);
  res.setHeader("Content-Disposition", "attachment");
  res.setHeader("Content-Type", fileRes.headers.get("content-type") || "application/octet-stream");

  fileRes.body.pipe(res);
}
