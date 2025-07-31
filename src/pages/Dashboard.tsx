import React, { useEffect, useState } from 'react';
import { Users, Building2, Activity, TrendingUp, Calendar, Phone } from 'lucide-react';
import { Patient, Facility } from '../types';
import { patientAPI, facilityAPI } from '../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalFacilities: 0,
    recentPatients: 0,
    activeServices: 0,
  });
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [patientsResponse, facilitiesResponse] = await Promise.all([
        patientAPI.getAll(),
        facilityAPI.getAll(),
      ]);

      if (patientsResponse.success && facilitiesResponse.success) {
        const patients = patientsResponse.data;
        const facilities = facilitiesResponse.data;

        // Calculate recent patients (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentCount = patients.filter(p => 
          p.createdAt && new Date(p.createdAt) >= thirtyDaysAgo
        ).length;

        setStats({
          totalPatients: patients.length,
          totalFacilities: facilities.length,
          recentPatients: recentCount,
          activeServices: patients.reduce((sum, p) => sum + p.services.length, 0),
        });

        // Get 5 most recent patients
        setRecentPatients(
          patients
            .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
            .slice(0, 5)
        );
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value.toLocaleString()}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your EMR system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Facilities"
          value={stats.totalFacilities}
          icon={<Building2 className="h-6 w-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Recent Registrations"
          value={stats.recentPatients}
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="bg-purple-500"
          subtitle="Last 30 days"
        />
        <StatCard
          title="Active Services"
          value={stats.activeServices}
          icon={<Activity className="h-6 w-6 text-white" />}
          color="bg-orange-500"
        />
      </div>

      {/* Recent Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Patients</h3>
          </div>
          <div className="p-6">
            {recentPatients.length > 0 ? (
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-xs text-gray-500">MRN: {patient.mrn}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {patient.phoneNumber}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent patients</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              <Users className="h-4 w-4 mr-2" />
              Register New Patient
            </button>
            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Building2 className="h-4 w-4 mr-2" />
              Add New Facility
            </button>
            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Activity className="h-4 w-4 mr-2" />
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;