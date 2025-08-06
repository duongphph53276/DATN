import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Kiểm tra biến môi trường
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error('Thiếu thông tin EMAIL_USER hoặc EMAIL_PASS trong .env');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  if (!email || !token) {
    throw new Error('Email hoặc token không được cung cấp');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Địa chỉ email không hợp lệ');
  }

  const verificationLink = `http://localhost:5000/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Xác thực email của bạn - Gấu Bông Shop',
    html: `
      <h2>Xin chào!</h2>
      <p>Cảm ơn bạn đã đăng ký tại Gấu Bông Shop. Vui lòng nhấp vào liên kết dưới đây để xác thực email của bạn:</p>
      <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #ff4081; color: white; text-decoration: none; border-radius: 5px;">Xác thực email</a>
      <p>Liên kết sẽ hết hạn sau 1 giờ. Nếu bạn không yêu cầu điều này, hãy bỏ qua email này.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email xác thực đã được gửi đến:', email, 'vào thời gian:', new Date().toISOString());
  } catch (error) {
    console.error('Lỗi khi gửi email:', error.message, 'Chi tiết:', error.stack);
    throw new Error(`Không thể gửi email xác thực: ${error.message}`);
  }
};

export { sendVerificationEmail };