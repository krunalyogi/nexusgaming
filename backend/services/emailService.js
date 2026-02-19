const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationEmail = async (email, token) => {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    try {
        await transporter.sendMail({
            from: `"Nexus Gaming" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Nexus Gaming Account',
            html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#1a1a2e;color:#fff;padding:40px;border-radius:12px;">
          <h1 style="color:#6c63ff;text-align:center;">🎮 Nexus Gaming</h1>
          <h2 style="text-align:center;">Verify Your Email</h2>
          <p style="text-align:center;color:#ccc;">Click the button below to verify your account.</p>
          <div style="text-align:center;margin:30px 0;">
            <a href="${verifyUrl}" style="background:#6c63ff;color:#fff;padding:14px 40px;border-radius:8px;text-decoration:none;font-size:16px;">Verify Email</a>
          </div>
          <p style="text-align:center;color:#888;font-size:12px;">If you didn't create an account, ignore this email.</p>
        </div>
      `,
        });
        return true;
    } catch (error) {
        console.error('Email send failed:', error.message);
        return false;
    }
};

module.exports = { sendVerificationEmail };
