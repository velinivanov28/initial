const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, message, 'g-recaptcha-response': token } = req.body;

  if (!name || !email || !message || !token) {
    return res.status(400).json({ message: 'Всички полета и reCAPTCHA са задължителни.' });
  }

  try {
    // ✅ Verify token with Google
    const verifyResponse = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      },
    });

    const { success, score, action } = verifyResponse.data;

    if (!success || score < 0.5 || action !== 'contact') {
      return res.status(400).json({ message: 'reCAPTCHA validation failed. Моля, опитайте отново.' });
    }

    // ✅ Passed reCAPTCHA – handle the message
    console.log('📬 New form:', { name, email, message });

    return res.status(200).json({ message: 'Съобщението беше изпратено успешно!' });
  } catch (err) {
    console.error('reCAPTCHA error:', err.message);
    return res.status(500).json({ message: 'Сървърна грешка при reCAPTCHA проверка.' });
  }
};
