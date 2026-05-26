import api from './api';

export const interviewService = {
  async generateQuestions(domain, difficulty, count = 5) {
    const { data } = await api.get('/questions/generate', {
      params: { domain, difficulty, count }
    });
    return data;
  },

  async submitAnswer(payload) {
    const { data } = await api.post('/answers/submit', payload);
    return data;
  },

  async completeInterview(interviewId) {
    const { data } = await api.post(`/interviews/${interviewId}/complete`);
    return data;
  },

  async getInterview(interviewId) {
    const { data } = await api.get(`/interviews/${interviewId}`);
    return data;
  },

  async getHistory() {
    const { data } = await api.get('/interviews/history');
    return data;
  }
};
