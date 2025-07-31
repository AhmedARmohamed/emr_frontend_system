import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Building2 } from 'lucide-react';

const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            EMR System
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Secure healthcare management system
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div>
            <button
              onClick={() => login()}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Connecting...' : 'Login with Keycloak'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Secure authentication via Keycloak
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;