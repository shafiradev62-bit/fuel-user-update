import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  console.log('API Key:', process.env.RESEND_API_KEY);
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['test@example.com'],
      subject: 'Test Email',
      html: '<p>Test email from FuelFriendly</p>',
    });

    if (error) {
      console.error('Resend Error:', error);
      return;
    }

    console.log('Success:', data);
  } catch (err) {
    console.error('Catch Error:', err);
  }
}

testEmail();