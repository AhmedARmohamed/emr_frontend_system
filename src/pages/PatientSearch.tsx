import React, { useState } from 'react';
import { Patient } from '../types';
import { patientAPI } from '../services/api';
import PatientSearch from '../components/Patients/PatientSearch';
import PatientList from '../components/Patients/PatientList';
import toast from 'react-hot-toast';

const PatientSearchPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await patientAPI.search(query);
      if (response.success) {
        setSearchResults(response.data);
        setHasSearched(true);
      } else {
        toast.error('Search failed');
      }
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = (filters: any) => {
    // In a real app, this would apply filters to the search
    console.log('Applying filters:', filters);
  };

  const handleEdit = (patient: Patient) => {
    toast.success(`Edit functionality for ${patient.firstName} ${patient.lastName}`);
  };

  const handleDelete = async (patientId: string) => {
    try {
      const response = await patientAPI.delete(patientId);
      if (response.success) {
        toast.success('Patient deleted successfully');
        setSearchResults(searchResults.filter(p => p.id !== patientId));
      } else {
        toast.error('Failed to delete patient');
      }
    } catch (error) {
      toast.error('Failed to delete patient');
    }
  };

  const handleView = (patient: Patient) => {
    toast.success(`Viewing ${patient.firstName} ${patient.lastName}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search Patients</h1>
        <p className="text-gray-600">Find patients by name, MRN, email, or phone number</p>
      </div>

      <PatientSearch
        onSearch={handleSearch}
        onFilter={handleFilter}
        isLoading={isLoading}
      />

      {hasSearched && (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Search Results ({searchResults.length})
            </h2>
          </div>
          
          <PatientList
            patients={searchResults}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            isLoading={isLoading}
          />
        </div>
      )}

      {hasSearched && searchResults.length === 0 && !isLoading && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No patients found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default PatientSearchPage;