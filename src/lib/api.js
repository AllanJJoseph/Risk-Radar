/**
 * API client for Risk Radar backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

export const api = {
  // User endpoints
  async createOrUpdateUser(userData) {
    return apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async getUserByEmail(email) {
    return apiCall(`/users/${encodeURIComponent(email)}`);
  },

  async updateUser(userId, userData) {
    return apiCall(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Financial data endpoints
  async getFinancialData(userId) {
    return apiCall(`/financial-data/${userId}`);
  },

  async saveFinancialSnapshot(userId, snapshot) {
    return apiCall(`/financial-data/${userId}/snapshot`, {
      method: 'POST',
      body: JSON.stringify(snapshot),
    });
  },

  async addMilestone(userId, milestone) {
    return apiCall(`/financial-data/${userId}/milestone`, {
      method: 'POST',
      body: JSON.stringify(milestone),
    });
  },

  async addBadge(userId, badge) {
    return apiCall(`/financial-data/${userId}/badge`, {
      method: 'POST',
      body: JSON.stringify(badge),
    });
  },
};
