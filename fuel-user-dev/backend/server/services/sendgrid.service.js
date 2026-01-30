import sgMail from '@sendgrid/mail';

export async function sendEmailOTP(email, otp) {
  try {
    // Validate API key exists
    if (!process.env.SENDGRID_API_KEY) {
      console.error('❌ SENDGRID_API_KEY is not configured');
      return {
        success: false,
        error: 'Email service is not configured. Please contact support.'
      };
    }

    // Validate email parameter
    if (!email || typeof email !== 'string') {
      console.error('❌ Invalid email parameter:', email);
      return {
        success: false,
        error: 'Invalid email address'
      };
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      console.error('❌ Invalid email format:', normalizedEmail);
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    console.log('🔑 Using SendGrid API Key:', process.env.SENDGRID_API_KEY?.substring(0, 10) + '...');
    console.log('📧 Sending OTP to:', normalizedEmail);
    console.log('🔐 OTP Code:', otp);
    
    // Set SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    // Create email message
    const msg = {
      to: normalizedEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@fuelfriendly.com',
      subject: 'Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4CAF50;">FuelFriendly</h2>
          <p>Your verification code is:</p>
          <div style="font-size: 24px; font-weight: bold; color: #333; margin: 20px 0;">${otp}</div>
          <p style="color: #666;">This code expires in 5 minutes.</p>
        </div>
      `,
    };
    
    // Send email
    try {
      await sgMail.send(msg);
      console.log('✅ Email sent successfully via SendGrid');
      
      return {
        success: true,
        messageId: 'sendgrid-' + Date.now() // SendGrid doesn't immediately return a message ID
      };
    } catch (sendError) {
      console.error('❌ SendGrid send() error:', sendError);
      
      let errorMessage = 'Failed to send email. Please try again.';
      if (sendError.response) {
        console.error('❌ SendGrid API error response:', sendError.response.body);
        errorMessage = sendError.response.body?.errors?.[0]?.message || errorMessage;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  } catch (err) {
    console.error('❌ Unexpected email error:', err);
    console.error('❌ Error stack:', err.stack);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred while sending email'
    };
  }
}