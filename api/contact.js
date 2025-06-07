// /api/contact.js
const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, message, 'g-recaptcha-response': token } = req.body;

  // 1. Validate fields
  if (!name || !email || !message || !token) {
    return res.status(400).json({ message: 'All fields and reCAPTCHA are required.' });
  }

  // 2. Verify reCAPTCHA
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  try {
    const verify = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret,
          response: token,
        },
      }
    );

    if (!verify.data.success) {
      return res.status(400).json({ message: 'reCAPTCHA verification failed.' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Error validating reCAPTCHA.' });
  }

  // 3. Send email or store (optional)
  // For example: use Nodemailer here to send email
  console.log('New contact form submission:', { name, email, message });

  return res.status(200).json({ message: 'Message sent successfully!' });
};
