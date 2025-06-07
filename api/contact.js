export default async (req, res) => {
  const token = req.body['g-recaptcha-response'];

  const verifyResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: token,
    }),
  });

  const data = await verifyResponse.json();
  console.log(data);

  if (!data.success) {
    return res.status(400).json({ message: 'reCAPTCHA verification failed' });
  }

  return res.status(200).json({ message: 'Success!' });
};
