import axios from 'axios';

// Base URL for Laravel API
export const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create a pre-configured axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Type definitions
interface AcceptPayload {
  technician_names: string[];
}

interface ReschedulePayload {
  service_name: string;
  new_date: string;
}

// API endpoints functions
export const appointmentsApi = {
  getAll: () => apiClient.get('/appointments'),
  delete: (id: number | string, reason: string = '') => apiClient.delete(`/appointments/${id}`, { data: { reason } }),
  accept: (id: number | string, payload: AcceptPayload) => apiClient.post(`/appointments/${id}/accept`, payload),
  complete: (id: number | string) => apiClient.post(`/appointments/${id}/complete`),
  reschedule: (id: number | string, payload: ReschedulePayload) => apiClient.put(`/appointments/${id}/reschedule`, payload),
  getTechnicians: () => apiClient.get('/appointments/technicians')
};

export default apiClient;