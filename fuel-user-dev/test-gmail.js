// Test Nodemailer with Gmail SMTP
const nodemailer = require('nodemailer');

const testGmail = async () => {
  console.log('🧪 Testing Gmail SMTP...');
  
  // Create transporter
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com', // Your Gmail
      pass: 'your-app-password'     // Gmail App Password (not regular password)
    }
  });

  try {
    const info = await transporter.sendMail({
      from: '"FuelFriendly" <your-email@gmail.com>',
      to: 'test@gmail.com',
      subject: 'FuelFriendly Verification Code',
      html: '<p>Your verification code is: <strong>123456</strong></p>'
    });

    console.log('✅ Email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

// testGmail(); // Uncomment when you have Gmail credentials