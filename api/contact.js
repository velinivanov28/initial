export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, email, message, 'g-recaptcha-response': token } = req.body;

    if (!name || !email || !message || !token) {
      return res.status(400).json({ message: 'Моля, попълнете всички полета и потвърдете reCAPTCHA.' });
    }

    // Verify reCAPTCHA token
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    const result = await response.json();

    if (!result.success || result.score < 0.5 || result.action !== 'contact') {
      return res.status(400).json({ message: 'reCAPTCHA проверката е неуспешна.' });
    }

    // Everything passed
    console.log('✅ Contact form submitted:', { name, email, message });
    return res.status(200).json({ message: 'Съобщението е изпратено успешно!' });

  } catch (error) {
    console.error('❌ Server error:', error);
    return res.status(500).json({ message: 'Сървърна грешка.' });
  }
}
