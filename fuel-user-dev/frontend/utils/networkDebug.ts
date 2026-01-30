// Network Debug Utility
export const networkDebug = {
  async testConnection() {
    console.log('Testing network connections...');
    
    try {
      const apiBase = 'https://apidecor.kelolahrd.life';
      const response = await fetch(`${apiBase}/api/health`);
      console.log('API Response:', response.status, response.statusText);
      return response.ok;
    } catch (error) {
      console.error('Network Error:', error);
      return false;
    }
  }
};