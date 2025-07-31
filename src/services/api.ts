import axios from 'axios';
import { Patient, Facility, Service, LoginCredentials, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: any }>> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  getCurrentUser: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const patientAPI = {
  getAll: async (facilityId?: string): Promise<ApiResponse<Patient[]>> => {
    const params = facilityId ? { facilityId } : {};
    const response = await api.get('/patients', { params });
    return response.data;
  },
  
  getById: async (id: string): Promise<ApiResponse<Patient>> => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },
  
  create: async (patient: Omit<Patient, 'id'>): Promise<ApiResponse<Patient>> => {
    const response = await api.post('/patients', patient);
    return response.data;
  },
  
  update: async (id: string, patient: Partial<Patient>): Promise<ApiResponse<Patient>> => {
    const response = await api.put(`/patients/${id}`, patient);
    return response.data;
  },
  
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },
  
  search: async (query: string): Promise<ApiResponse<Patient[]>> => {
    const response = await api.get(`/patients/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
};

export const facilityAPI = {
  getAll: async (): Promise<ApiResponse<Facility[]>> => {
    const response = await api.get('/facilities');
    return response.data;
  },
  
  getById: async (id: string): Promise<ApiResponse<Facility>> => {
    const response = await api.get(`/facilities/${id}`);
    return response.data;
  },
  
  create: async (facility: Omit<Facility, 'id'>): Promise<ApiResponse<Facility>> => {
    const response = await api.post('/facilities', facility);
    return response.data;
  },
  
  update: async (id: string, facility: Partial<Facility>): Promise<ApiResponse<Facility>> => {
    const response = await api.put(`/facilities/${id}`, facility);
    return response.data;
  },
  
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/facilities/${id}`);
    return response.data;
  }
};

export const serviceAPI = {
  getAll: async (): Promise<ApiResponse<Service[]>> => {
    const response = await api.get('/services');
    return response.data;
  },
  
  getByType: async (type: string): Promise<ApiResponse<Service[]>> => {
    const response = await api.get(`/services?type=${type}`);
    return response.data;
  }
};

export default api;