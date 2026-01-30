// Tambahkan fungsi ini ke frontend/services/api.ts

export const apiGetOrderDetail = async (orderId: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch order details');
    }
    
    return result.data;
  } catch (error) {
    console.error('API Error - Get Order Detail:', error);
    throw error;
  }
};