import axios from 'axios';
import { Patient, Facility, Service, ApiResponse } from '../types';
import keycloak from './keycloak';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = keycloak.token || localStorage.getItem('authToken');
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
      // Token expired, try to refresh
      if (keycloak.authenticated) {
        keycloak.updateToken(5).catch(() => {
          keycloak.login();
        });
      } else {
        keycloak.login();
      }
    }
    return Promise.reject(error);
  }
);

export const patientAPI = {
  getAll: async (facilityId?: number): Promise<ApiResponse<Patient[]>> => {
    const response = await api.get('/patients/search', {
      params: { 
        facilityId: facilityId || 1, 
        page: 0, 
        size: 100 
      }
    });
    // Transform PageResponse to simple array
    return {
      ...response.data,
      data: response.data.data.content || []
    };
  },
  
  getById: async (id: number): Promise<ApiResponse<Patient>> => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },
  
  create: async (patient: Omit<Patient, 'id'>): Promise<ApiResponse<Patient>> => {
    const response = await api.post('/patients', patient);
    return response.data;
  },
  
  update: async (id: number, patient: Partial<Patient>): Promise<ApiResponse<Patient>> => {
    const response = await api.put(`/patients/${id}`, patient);
    return response.data;
  },
  
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },
  
  search: async (query: string): Promise<ApiResponse<Patient[]>> => {
    const response = await api.get('/patients/search', {
      params: { 
        facilityId: 1, 
        search: query, 
        page: 0, 
        size: 100 
      }
    });
    // Transform PageResponse to simple array
    return {
      ...response.data,
      data: response.data.data.content || []
    };
  }
};

export const facilityAPI = {
  getAll: async (): Promise<ApiResponse<Facility[]>> => {
    const response = await api.get('/facilities');
    return response.data;
  },
  
  getById: async (id: number): Promise<ApiResponse<Facility>> => {
    const response = await api.get(`/facilities/${id}`);
    return response.data;
  },
  
  create: async (facility: Omit<Facility, 'id'>): Promise<ApiResponse<Facility>> => {
    const response = await api.post('/facilities', facility);
    return response.data;
  },
  
  update: async (id: number, facility: Partial<Facility>): Promise<ApiResponse<Facility>> => {
    const response = await api.put(`/facilities/${id}`, facility);
    return response.data;
  },
  
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/facilities/${id}`);
    return response.data;
  }
};

export const serviceAPI = {
  getAll: async (): Promise<ApiResponse<Service[]>> => {
    // Mock services since your backend doesn't have this endpoint yet
    return {
      success: true,
      data: [
        {
          id: '1',
          name: 'Blood Test',
          type: 'LAB' as const,
          description: 'Complete blood count and analysis',
          price: 50
        },
        {
          id: '2',
          name: 'X-Ray',
          type: 'RADIOLOGY' as const,
          description: 'Digital X-ray imaging',
          price: 100
        },
        {
          id: '3',
          name: 'General Consultation',
          type: 'CONSULTATION' as const,
          description: 'General medical consultation',
          price: 75
        }
      ]
    };
  },
  
  getByType: async (type: string): Promise<ApiResponse<Service[]>> => {
    const allServices = await serviceAPI.getAll();
    return {
      ...allServices,
      data: allServices.data.filter(service => service.type === type)
    };
  }
};

export default api;