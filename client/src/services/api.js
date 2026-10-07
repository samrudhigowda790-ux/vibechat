/**
 * VibeChat API Service
 * Communicates with Node.js/Express backend on http://localhost:5000/api
 * Falls back gracefully to local state if backend is disconnected.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = {
  // Check health and Aiven PostgreSQL status
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Get conversations
  async getConversations() {
    try {
      const res = await fetch(`${API_BASE_URL}/conversations`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Create conversation
  async createConversation(data) {
    try {
      const res = await fetch(`${API_BASE_URL}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Get messages for a conversation
  async getMessages(conversationId) {
    try {
      const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Send message
  async sendMessage(conversationId, messageData) {
    try {
      const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Get insights
  async getInsights(conversationId) {
    try {
      const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}/insights`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Standalone Vibe Analyzer
  async analyzeVibe(text) {
    try {
      const res = await fetch(`${API_BASE_URL}/vibe/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },
};
