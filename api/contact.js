export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Parse form data from request
    const body = await getFormData(req);
    const { name, email, message, 'g-recaptcha-response': token } = body;

    if (!name || !email || !message || !token) {
      return res.status(400).json({ message: 'Моля, попълнете всички полета и потвърдете reCAPTCHA.' });
    }

    // Verify reCAPTCHA with Google
    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.success || verifyData.score < 0.5 || verifyData.action !== 'contact') {
      return res.status(400).json({ message: 'reCAPTCHA проверката е неуспешна. Моля, опитайте отново.' });
    }

    // Everything OK
    console.log('📨 Message received:', { name, email, message });

    return res.status(200).json({ message: 'Съобщението е изпратено успешно!' });
  } catch (err) {
    console.error('❌ Server error:', err);
    return res.status(500).json({ message: 'Сървърна грешка при обработката на формуляра.' });
  }
}

// Helper to parse multipart/form-data (used by FormData)
async function getFormData(req) {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const bodyStr = Buffer.concat(buffers).toString();
  const params = new URLSearchParams(bodyStr);
  const data = {};
  for (const [key, value] of params.entries()) {
    data[key] = value;
  }
  return data;
}
