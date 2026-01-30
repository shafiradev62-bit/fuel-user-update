import twilio from 'twilio';

// Use main account credentials
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSMSOTP(phoneNumber, otp) {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      return { success: false, error: 'Twilio not configured' };
    }

    if (!process.env.TWILIO_PHONE_NUMBER) {
      return { success: false, error: 'Twilio phone number not configured' };
    }

    // Detect language based on country code
    const isIndonesian = phoneNumber.startsWith('62') || phoneNumber.startsWith('+62');
    
    const message = isIndonesian 
      ? `🔐 FuelFriendly OTP\n\nKode verifikasi Anda: ${otp}\n\nKode berlaku selama 5 menit.\nJangan bagikan kode ini kepada siapapun.`
      : `🔐 FuelFriendly OTP\n\nYour verification code: ${otp}\n\nCode expires in 5 minutes.\nDo not share this code with anyone.`;

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`
    });

    return { 
      success: true, 
      messageId: result.sid,
      message: 'SMS OTP sent successfully'
    };
  } catch (error) {
    console.error('Twilio SMS error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to send SMS OTP' 
    };
  }
}