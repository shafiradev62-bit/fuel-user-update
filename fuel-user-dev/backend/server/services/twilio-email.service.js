import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendTwilioEmailOTP(email, otp) {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      return { success: false, error: 'Twilio not configured' };
    }

    // Detect language
    const isIndonesian = email.includes('gmail.com') || email.includes('.id');
    
    const subject = isIndonesian 
      ? 'Kode Verifikasi FuelFriendly'
      : 'FuelFriendly Verification Code';
      
    const message = isIndonesian
      ? `Kode verifikasi Anda: ${otp}\n\nKode berlaku selama 5 menit.\nJangan bagikan kode ini kepada siapapun.`
      : `Your verification code: ${otp}\n\nCode expires in 5 minutes.\nDo not share this code with anyone.`;

    // Twilio SendGrid Email API
    const result = await client.messages.create({
      from: 'noreply@fuelfriendly.com', // Use your domain or Twilio's
      to: email,
      subject: subject,
      body: message
    });

    return { 
      success: true, 
      messageId: result.sid,
      message: 'Email OTP sent successfully via Twilio'
    };
  } catch (error) {
    console.error('Twilio Email error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to send email OTP via Twilio' 
    };
  }
}