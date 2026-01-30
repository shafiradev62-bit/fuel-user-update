import { Resend } from 'resend';

const resend = new Resend('re_RkG9R3Wr_GP5gUh8KTLgedUJVwCDtKc6r');

const { data, error } = await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: ['test@example.com'],
  subject: 'OTP Test',
  html: '<p>Your OTP: <strong>123456</strong></p>',
});

if (error) {
  console.error('Error:', error);
} else {
  console.log('Success:', data);
}