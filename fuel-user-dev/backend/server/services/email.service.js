import { Resend } from "resend";
import sgMail from '@sendgrid/mail';

async function sendSendGridOTP(email, otp) {
  try {
    console.log('🔑 Using SendGrid API Key:', process.env.SENDGRID_API_KEY?.substring(0, 10) + '...');
    console.log('📧 From Email:', process.env.SENDGRID_FROM_EMAIL);
    
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const language = detectLanguageFromEmail(email);
    const emailContent = getEmailOTPContent(otp, language);
    
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@sendgrid.net',
      subject: emailContent.subject,
      html: emailContent.html
    };
    
    console.log('📧 Sending email via SendGrid to:', email);
    const result = await sgMail.send(msg);
    console.log('✅ SendGrid email sent successfully');
    
    return {
      success: true,
      messageId: result[0].headers['x-message-id'] || 'sendgrid-' + Date.now()
    };
  } catch (error) {
    console.error('❌ SendGrid error details:', error.response?.body || error.message);
    
    // Handle specific SendGrid errors
    if (error.code === 403) {
      return {
        success: false,
        error: 'SendGrid API key is invalid or not authorized. Please check your API key.'
      };
    }
    
    return {
      success: false,
      error: error.message || 'Failed to send email via SendGrid'
    };
  }
}

function detectLanguageFromEmail(email) {
  // Always return English for now
  return 'en'
}

function getEmailOTPContent(otp, language) {
  const content = {
    'id': {
      subject: 'Kode Verifikasi FuelFriendly',
      title: 'FuelFriendly',
      greeting: 'Kode verifikasi Anda adalah:',
      footer: 'Kode ini berlaku selama 5 menit.',
      color: '#4CAF50'
    },
    'en': {
      subject: 'FuelFriendly Verification Code',
      title: 'FuelFriendly', 
      greeting: 'Your verification code is:',
      footer: 'This code expires in 5 minutes.',
      color: '#4CAF50'
    }
  }
  
  const lang = content[language] || content['en']
  
  return {
    subject: lang.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: ${lang.color};">${lang.title}</h2>
        <p>${lang.greeting}</p>
        <div style="font-size: 24px; font-weight: bold; color: #333; margin: 20px 0;">${otp}</div>
        <p style="color: #666;">${lang.footer}</p>
      </div>
    `
  }
}

export async function sendEmailOTP(email, otp) {
  try {
    // Check if we're in development mode and want to simulate email sending
    const isDevelopmentMode = process.env.NODE_ENV === 'development';
    const simulateEmailSending = process.env.SIMULATE_EMAIL_SENDING === 'true';
    
    if (isDevelopmentMode && simulateEmailSending) {
      console.log('📧 SIMULATED: OTP email sent to:', email);
      console.log('🔐 SIMULATED OTP Code:', otp);
      console.log('📝 NOTE: In a real production environment, this OTP would be sent to the email address above.');
      
      // Simulate success
      return {
        success: true,
        messageId: 'simulated-' + Date.now(),
        simulated: true,
        otp: otp // Include the OTP in the response for development testing
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

    // Normalize email (trim whitespace and convert to lowercase)
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check SendGrid first, then Resend
    if (process.env.SENDGRID_API_KEY) {
      return await sendSendGridOTP(normalizedEmail, otp);
    }
    
    // Validate API key exists
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ No email service configured');
      return {
        success: false,
        error: 'Email service is not configured. Please contact support.'
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      console.error('❌ Invalid email format:', normalizedEmail);
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    console.log('🔑 Using API Key:', process.env.RESEND_API_KEY?.substring(0, 10) + '...');
    console.log('📧 Sending OTP to:', normalizedEmail);
    console.log('🔐 OTP Code:', otp);
    
    // Auto-add email to Resend contacts before sending
    try {
      const addContactResponse = await fetch('https://api.resend.com/audiences/78261da4-41a8-4ef8-8c49-c57536b363de/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: normalizedEmail,
          first_name: normalizedEmail.split('@')[0],
          last_name: 'User'
        })
      });
      
      if (addContactResponse.ok) {
        console.log('✅ Added to Resend contacts:', normalizedEmail);
      } else {
        console.log('⚠️ Failed to add to contacts (may already exist):', normalizedEmail);
      }
      
      // Wait 1 second to avoid rate limit (2 requests/second)
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (contactError) {
      console.log('⚠️ Contact add error (continuing anyway):', contactError.message);
    }
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    let data, error;
    try {
      // Use onboarding@resend.dev for testing if a verified domain is not configured
      const fromEmail = process.env.RESEND_FROM_EMAIL && !process.env.RESEND_FROM_EMAIL.includes('@gmail.com') 
        ? process.env.RESEND_FROM_EMAIL 
        : 'onboarding@resend.dev';
      
      // Detect language and get appropriate content
      const language = detectLanguageFromEmail(normalizedEmail)
      const emailContent = getEmailOTPContent(otp, language)
      
      const result = await resend.emails.send({
        from: fromEmail,
        to: normalizedEmail,
        subject: emailContent.subject,
        html: emailContent.html
      });
      
      data = result.data;
      error = result.error;
    } catch (sendError) {
      console.error('❌ Resend send() threw error:', sendError);
      return {
        success: false,
        error: sendError.message || 'Failed to send email. Please try again.'
      };
    }
    
    console.log('📧 Resend response - data:', data ? 'present' : 'null', 'error:', error ? 'present' : 'null');
    
    if (error) {
      console.error('❌ Resend API error details:', JSON.stringify(error, null, 2));
      
      // Handle specific Resend error types
      let errorMessage = 'Failed to send email';
      if (error.message) {
        errorMessage = error.message;
        // Provide a more helpful error message for domain verification issues
        if (errorMessage.includes('only send testing emails to your own email address')) {
          errorMessage = 'Email service limitation: With the free Resend account, OTP can only be sent to verified email addresses. To send OTP to other email addresses, please upgrade your Resend account and verify a domain.';
        } else if (errorMessage.includes('domain is not verified')) {
          errorMessage = 'Email service error: The sender domain is not verified. Please verify your domain in the Resend dashboard or use the default onboarding@resend.dev address.';
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.name) {
        errorMessage = `${error.name}: ${error.message || 'Unknown error'}`;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
    
    if (!data) {
      console.error('❌ No data returned from Resend API');
      return {
        success: false,
        error: 'Failed to send email: No response from email service'
      };
    }
    
    if (!data.id) {
      console.error('❌ Unexpected response from Resend API - no id:', JSON.stringify(data, null, 2));
      return {
        success: false,
        error: 'Failed to send email: Invalid response from email service'
      };
    }
    
    console.log('✅ Email sent successfully, message ID:', data.id);
    return {
      success: true,
      messageId: data.id
    };
  } catch (err) {
    console.error('❌ Unexpected email error:', err);
    console.error('❌ Error stack:', err.stack);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred while sending email'
    };
  }
}