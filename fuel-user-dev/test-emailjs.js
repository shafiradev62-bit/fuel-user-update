// Test EmailJS credentials
const testEmailJS = async () => {
  const credentials = {
    service_id: 'service_8y8reng',
    template_id: 'template_k4j9jvk', 
    user_id: 'wFW51WEG9DkRjKdff'
  };

  console.log('🧪 Testing EmailJS credentials...');
  console.log('Service ID:', credentials.service_id);
  console.log('Template ID:', credentials.template_id);
  console.log('User ID:', credentials.user_id);

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service_id: credentials.service_id,
        template_id: credentials.template_id,
        user_id: credentials.user_id,
        template_params: {
          to_name: 'Test User',
          to_email: 'test@gmail.com',
          message: 'Your FuelFriendly verification code is: 123456',
          otp: '123456'
        }
      })
    });

    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      
      if (response.status === 404) {
        console.log('💡 Solution: EmailJS account/service not found');
        console.log('   - Check if service_id exists in your EmailJS dashboard');
        console.log('   - Verify user_id (public key) is correct');
      }
    } else {
      console.log('✅ Email sent successfully!');
    }
    
  } catch (error) {
    console.error('🚨 Network error:', error.message);
  }
};

testEmailJS();