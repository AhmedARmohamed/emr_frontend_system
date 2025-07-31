export interface Patient {
  id?: number;
  mrn: string;
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  facilityId: number;
  services: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Facility {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  type: string;
  createdAt?: string;
}

export interface Service {
  id: string;
  name: string;
  type: 'LAB' | 'RADIOLOGY' | 'CONSULTATION';
  description?: string;
  price?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'FACILITY_MANAGER' | 'STAFF';
  facilityId?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}