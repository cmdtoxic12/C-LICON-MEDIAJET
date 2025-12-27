export const config = {
  runtime: 'edge', // This is the key to supporting large files
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) return new Response('Missing URL', { status: 400 });

  try {
    const response = await fetch(url);
    
    // We create a new response that "pipes" the video data
    const newResponse = new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Disposition': 'attachment; filename="video.mp4"',
        'Content-Type': response.headers.get('content-type') || 'video/mp4',
        'Access-Control-Allow-Origin': '*',
      },
    });

    return newResponse;
  } catch (e) {
    return new Response('Error: ' + e.message, { status: 500 });
  }
}
