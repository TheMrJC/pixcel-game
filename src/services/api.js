// src/services/api.js

// Allow override via env, but fallback to a placeholder if not set (User must set this!)
const API_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

export const api = {
  async fetchQuestions(count = 10) {
    if (!API_URL) {
      console.warn("VITE_GOOGLE_APP_SCRIPT_URL is not set.");
      // Return mock data for dev if no URL
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(Array.from({ length: count }, (_, i) => ({
            id: i,
            question: `Mock Question ${i + 1}`,
            options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D' },
            answer: 'A'
          })));
        }, 1000);
      });
    }

    try {
      const response = await fetch(`${API_URL}?count=${count}`);
      if (!response.ok) throw new Error('Network error');
      return await response.json();
    } catch (err) {
      console.error("API Fetch Error:", err);
      // Fallback or rethrow
      throw err;
    }
  },

  async submitScore(data) {
    // data: { userId, userAnswers, passThreshold }
    if (!API_URL) {
      console.warn("VITE_GOOGLE_APP_SCRIPT_URL is not set. Mocking submission.");
      return { status: 'success', score: 999, passed: true };
    }

    // Google Apps Script requires 'no-cors' sometimes if not handled perfectly, 
    // but usually standard fetch works if 'Anyone' access.
    // However, POST to GAS usually requires using text/plain and following redirects.
    // 'no-cors' will result in opaque response, preventing us from reading the JSON result.
    // Standard fetch should work if the script returns correct CORS headers, 
    // BUT GAS default doesn't easily support CORS for POST from browser directly.
    // WORKAROUND: Use 'application/x-www-form-urlencoded' or similar if needed.
    // But simplest for GAS Web App:
    // Send as text/plain (to avoid preflight) and handle in doPost with JSON.parse(e.postData.contents).

    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(data),
      mode: 'cors' // Try cors first. If user faces issues, we might need a proxy or no-cors (blind submit).
      // Note: GAS web apps often have redirects that fetch follows automatically.
    });

    return await response.json();
  }
};
