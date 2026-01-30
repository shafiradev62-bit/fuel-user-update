// Try EmailJS with different approach
const testEmailJSWorkaround = async () => {
  console.log('🧪 Testing EmailJS workaround...');
  
  const data = {
    service_id: 'service_8y8reng',
    template_id: 'template_k4j9jvk',
    user_id: 'wFW51WEG9DkRjKdff',
    template_params: {
      to_name: 'Test User',
      to_email: 'test@gmail.com',
      message: 'Your FuelFriendly verification code is: 123456',
      otp: '123456'
    }
  };

  // Try different endpoints
  const endpoints = [
    'https://api.emailjs.com/api/v1.0/email/send',
    'https://api.emailjs.com/api/v1.0/email/send-form',
    `https://api.emailjs.com/api/v1.0/email/send/${data.service_id}`
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Trying: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify(data)
      });

      console.log('Status:', response.status);
      const result = await response.text();
      console.log('Response:', result);
      
      if (response.ok) {
        console.log('✅ Success with:', endpoint);
        return;
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }
  
  console.log('\n💡 EmailJS memang tidak support server-side calls');
};

testEmailJSWorkaround();