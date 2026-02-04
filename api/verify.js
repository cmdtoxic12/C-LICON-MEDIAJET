// api/verify.js
const https = require('https');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { reference } = req.body;

  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/transaction/verify/${reference}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
    }
  };

  const verifyRequest = https.request(options, apiRes => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      const responseData = JSON.parse(data);
      if (responseData.status && responseData.data.status === 'success') {
        // Success! You can now update your database here
        res.status(200).json({ status: 'success', message: 'Payment Verified' });
      } else {
        res.status(400).json({ status: 'failed', message: 'Verification failed' });
      }
    });
  }).on('error', error => {
    res.status(500).json({ status: 'error', message: error.message });
  });

  verifyRequest.end();
}

