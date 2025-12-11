import axios from 'axios';
import type { AcceptPayload, ReschedulePayload } from '../types/appointment';

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

// API endpoints functions with AbortSignal support
export const appointmentsApi = {
  getAll: (signal?: AbortSignal) => 
    apiClient.get('/appointments', { signal }),
  
  delete: (id: number | string, reason: string = '', signal?: AbortSignal) => 
    apiClient.delete(`/appointments/${id}`, { data: { reason }, signal }),
  
  accept: (id: number | string, payload: AcceptPayload, signal?: AbortSignal) => 
    apiClient.post(`/appointments/${id}/accept`, payload, { signal }),
  
  complete: (id: number | string, signal?: AbortSignal) => 
    apiClient.post(`/appointments/${id}/complete`, {}, { signal }),
  
  reschedule: (id: number | string, payload: ReschedulePayload, signal?: AbortSignal) => 
    apiClient.put(`/appointments/${id}/reschedule`, payload, { signal }),
  
  getTechnicians: (signal?: AbortSignal) => 
    apiClient.get('/appointments/technicians', { signal }),
  
  returnToPending: (id: number | string, signal?: AbortSignal) => 
    apiClient.post(`/appointments/${id}/return-to-pending`, {}, { signal })
};

export default apiClient;