// Production Network Handler
class NetworkHandler {
  private isProduction = !window.location.hostname.includes('localhost');
  
  async makeRequest(url: string, options: RequestInit = {}) {
    const timeout = 15000; // 15 seconds
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (this.isProduction) {
        // Show user-friendly error in production
        console.error('Network Error:', error);
        throw new Error('Connection failed. Please check your internet connection.');
      }
      
      throw error;
    }
  }
}

export const networkHandler = new NetworkHandler();