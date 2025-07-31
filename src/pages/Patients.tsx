import React, { useState, useEffect } from 'react';
import { Patient } from '../types';
import { patientAPI } from '../services/api';
import PatientList from '../components/Patients/PatientList';
import PatientForm from '../components/Patients/PatientForm';
import { Plus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setIsLoading(true);
      const response = await patientAPI.getAll();
      if (response.success) {
        setPatients(response.data);
      } else {
        toast.error('Failed to load patients');
      }
    } catch (error) {
      toast.error('Failed to load patients');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePatient = async (patientData: Omit<Patient, 'id'>) => {
    try {
      setIsSubmitting(true);
      const response = await patientAPI.create(patientData);
      if (response.success) {
        toast.success('Patient created successfully');
        setPatients([response.data, ...patients]);
        setShowForm(false);
      } else {
        toast.error('Failed to create patient');
      }
    } catch (error) {
      toast.error('Failed to create patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePatient = async (patientData: Omit<Patient, 'id'>) => {
    if (!selectedPatient?.id) return;

    try {
      setIsSubmitting(true);
      const response = await patientAPI.update(selectedPatient.id, patientData);
      if (response.success) {
        toast.success('Patient updated successfully');
        setPatients(patients.map(p => p.id === selectedPatient.id ? response.data : p));
        setShowForm(false);
        setSelectedPatient(null);
      } else {
        toast.error('Failed to update patient');
      }
    } catch (error) {
      toast.error('Failed to update patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    try {
      const response = await patientAPI.delete(patientId);
      if (response.success) {
        toast.success('Patient deleted successfully');
        setPatients(patients.filter(p => p.id !== patientId));
      } else {
        toast.error('Failed to delete patient');
      }
    } catch (error) {
      toast.error('Failed to delete patient');
    }
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowForm(true);
  };

  const handleViewPatient = (patient: Patient) => {
    // In a real app, this would navigate to a patient detail page
    toast.success(`Viewing ${patient.firstName} ${patient.lastName}`);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedPatient(null);
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Patients
          </button>
        </div>

        <PatientForm
          patient={selectedPatient || undefined}
          onSubmit={selectedPatient ? handleUpdatePatient : handleCreatePatient}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600">Manage patient registrations and records</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Patient
        </button>
      </div>

      <PatientList
        patients={patients}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
        onView={handleViewPatient}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Patients;