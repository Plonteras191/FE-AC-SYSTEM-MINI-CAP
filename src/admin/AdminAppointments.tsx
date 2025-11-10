import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper.tsx';
import { appointmentsApi } from '../services/api.tsx';
import { toast } from 'react-toastify';
import AppointmentList from '../components/AppointmentList.tsx';
import AppointmentModals from '../components/AppointmentModals.tsx';
import PaginationControls from '../components/PaginationControls.tsx';

// Type definitions
interface Service {
  type: string;
  date: string;
  ac_types?: string[];
}

interface Appointment {
  id: number | string;
  status?: string;
  services?: string | Service[];
  technician_names?: string[];
}

interface Technician {
  id: number;
  name: string;
}

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [acceptedAppointments, setAcceptedAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [availableTechnicians, setAvailableTechnicians] = useState<Technician[]>([]);
  
  // Modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState<boolean>(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState<boolean>(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState<boolean>(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [newServiceDate, setNewServiceDate] = useState<string>('');
  
  // Technician assignment states
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [customTechnicianInput, setCustomTechnicianInput] = useState<string>('');
  
  // Tab and pagination states
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted'>('pending');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  


  useEffect(() => {
    // Fetch all appointments and technicians from Laravel backend
    fetchAppointments();
    fetchTechnicians();
  }, []);

  const fetchAppointments = () => {
    setIsLoading(true);
    appointmentsApi.getAll()
      .then(response => {
        let data = response.data;
        if (!Array.isArray(data)) data = [data];
        
        // Filter to show only pending appointments
        const pending = data.filter((appt: Appointment) => !appt.status || appt.status.toLowerCase() === 'pending');
        setAppointments(pending);
        
        // Filter to show only accepted appointments (pending for completion)
        const accepted = data.filter((appt: Appointment) => 
          appt.status && appt.status.toLowerCase() === 'accepted'
        );
        setAcceptedAppointments(accepted);
      })
      .catch(error => {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to load appointments");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchTechnicians = async () => {
    try {
      const response = await appointmentsApi.getTechnicians();
      setAvailableTechnicians(response.data);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    }
  };

  // Delete (reject) appointment
  const handleCancelAppointment = async (id: number | string) => {
    try {
      setIsLoading(true);
      await appointmentsApi.delete(id);
      setAppointments(prev => prev.filter(appt => appt.id !== id));
      toast.success("Appointment rejected successfully and notification email sent");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Failed to reject appointment");
    } finally {
      setIsLoading(false);
    }
  };

  // Open modal to confirm rejection
  const openRejectModal = (id: number | string) => {
    setSelectedAppointmentId(id);
    setIsConfirmModalOpen(true);
  };

  // Open modal to confirm acceptance
  const openAcceptModal = (id: number | string) => {
    setSelectedAppointmentId(id);
    setSelectedTechnicians([]);
    setCustomTechnicianInput('');
    setIsAcceptModalOpen(true);
  };

  // Open modal to confirm completion
  const openCompleteModal = (id: number | string) => {
    setSelectedAppointmentId(id);
    setIsCompleteModalOpen(true);
  };  // Open modal to reschedule a service
  const openRescheduleModal = (id: number | string, service: Service) => {
    setSelectedAppointmentId(id);
    setSelectedService(service.type);
    // Format the date to YYYY-MM-DD, handling both date-only and datetime formats
    const serviceDate = service.date ? new Date(service.date) : new Date();
    const formattedDate = serviceDate.toISOString().split('T')[0];
    setNewServiceDate(formattedDate);
    setIsRescheduleModalOpen(true);
  };

  // Confirm rejection and delete appointment
  const handleConfirmReject = () => {
    if (selectedAppointmentId !== null) {
      handleCancelAppointment(selectedAppointmentId);
    }
    setIsConfirmModalOpen(false);
    setSelectedAppointmentId(null);
  };

  // Close any modal without action
  const handleCancelModal = () => {
    setIsConfirmModalOpen(false);
    setIsAcceptModalOpen(false);
    setIsCompleteModalOpen(false);
    setIsRescheduleModalOpen(false);
    setSelectedAppointmentId(null);
    setSelectedTechnicians([]);
    setCustomTechnicianInput('');
  };

  // Handle technician selection from dropdown
  const handleTechnicianSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const technicianName = e.target.value;
    if (technicianName && !selectedTechnicians.includes(technicianName)) {
      setSelectedTechnicians(prev => [...prev, technicianName]);
    }
    e.target.value = ''; // Reset dropdown
  };

  // Remove selected technician
  const removeTechnician = (technicianName: string) => {
    setSelectedTechnicians(prev => prev.filter(name => name !== technicianName));
  };

  // Add custom technician
  const addCustomTechnician = () => {
    const name = customTechnicianInput.trim();
    if (name && !selectedTechnicians.includes(name)) {
      setSelectedTechnicians(prev => [...prev, name]);
      setCustomTechnicianInput('');
    }
  };

  // Handle Enter key for custom technician input
  const handleCustomTechnicianKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTechnician();
    }
  };



  // Accept appointment by sending a POST request with action=accept
  const handleAcceptAppointment = async (id: number | string) => {
    try {
      setIsLoading(true);
      const payload = {
        technician_names: selectedTechnicians
      };
      const response = await appointmentsApi.accept(id, payload);
      if (
        response.data &&
        response.data.status &&
        response.data.status.toLowerCase() === 'accepted'
      ) {
        // If appointment accepted successfully, refresh data
        fetchAppointments();
        toast.success("Appointment accepted and confirmation email sent.");
      }
    } catch (error: any) {
      console.error("Error accepting appointment:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to accept appointment");
      }
    } finally {
      setIsLoading(false);
      setIsAcceptModalOpen(false);
      setSelectedAppointmentId(null);
      setSelectedTechnicians([]);
      setCustomTechnicianInput('');
    }
  };

  // Complete appointment: update its status to "Completed"
  const completeAppointment = (id: number | string) => {
    setIsLoading(true);
    appointmentsApi.complete(id)
      .then(response => {
        const updatedAppointment = response.data;
        
        // Store the completed appointment in localStorage for later processing in Revenue component
        const stored = localStorage.getItem('completedAppointments');
        const completedAppointments = stored ? JSON.parse(stored) : [];
        
        // Check if this appointment is already in the completed list
        const exists = completedAppointments.some((app: any) => app.id === updatedAppointment.id);
        if (!exists) {
          completedAppointments.push(updatedAppointment);
          localStorage.setItem('completedAppointments', JSON.stringify(completedAppointments));
        }

        // Refresh appointments
        fetchAppointments();
        toast.success("Appointment marked as completed");
      })
      .catch(error => {
        console.error("Error completing appointment:", error);
        toast.error("Failed to complete appointment");
      })
      .finally(() => {
        setIsLoading(false);
        setIsCompleteModalOpen(false);
        setSelectedAppointmentId(null);
      });
  };
  // Confirm reschedule of a service
  const confirmReschedule = async () => {
    if (!selectedAppointmentId || !selectedService || !newServiceDate) {
      toast.error('Please select a new date');
      return;
    }

    const formattedDate = new Date(newServiceDate).toISOString().split('T')[0];
    const payload = { 
      service_name: selectedService, 
      new_date: formattedDate // Send date in YYYY-MM-DD format
    };
    
    try {
      setIsLoading(true);
      const response = await appointmentsApi.reschedule(selectedAppointmentId, payload);
      if (response.data && !response.data.error) {
        setAppointments(prev =>
          prev.map(appt => (appt.id === selectedAppointmentId ? response.data : appt))
        );
        toast.success("Service rescheduled successfully");
      } else {
        toast.error(response.data.error || "Failed to reschedule service");
      }
    } catch (error: any) {
      console.error("Error rescheduling service:", error);
      toast.error("Failed to reschedule service");
    } finally {
      setIsLoading(false);
      setIsRescheduleModalOpen(false);
      setSelectedAppointmentId(null);
      setSelectedService(null);
      setNewServiceDate('');
    }
  };

  // Utility function to parse services JSON string
  const parseServices = (servicesStr: string): Service[] => {
    try {
      return JSON.parse(servicesStr);
    } catch (error) {
      console.error("Error parsing services:", error);
      return [];
    }
  };

  // Utility function to parse services JSON string with numbering
  const parseServicesFormatted = (servicesStr: string): string => {
    try {
      const services = JSON.parse(servicesStr);
      return services.map((s: Service, index: number) => `${index + 1}. ${s.type} on ${s.date}`).join(' | ');
    } catch (error) {
      console.error("Error parsing services:", error);
      return 'N/A';
    }
  };

  // Utility function to parse AC types from the services JSON string with proper numbering per service
  const parseAcTypes = (servicesStr: string): string => {
    try {
      const services = JSON.parse(servicesStr);
      return services.map((s: Service, index: number) => {
        if (s.ac_types && s.ac_types.length > 0) {
          // Prefix each AC type with the service number
          return s.ac_types.map((ac: string) => `${index + 1}. ${ac}`).join(', ');
        } else {
          return 'N/A';
        }
      }).join(' | ');
    } catch (error) {
      console.error("Error parsing AC types:", error);
      return 'N/A';
    }
  };

  // Pagination handlers
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Calculate pagination for current view
  const getPaginatedData = () => {
    const currentData = activeTab === 'pending' ? appointments : acceptedAppointments;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return currentData.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Calculate total pages
  const totalPages = Math.ceil(
    (activeTab === 'pending' ? appointments.length : acceptedAppointments.length) / itemsPerPage
  );

  return (
    <PageWrapper>
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-linear-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M3 7h18M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Admin Appointments</h2>
                  <p className="text-gray-600 mt-1">Manage and track appointment requests</p>
                </div>
              </div>
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                  <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-blue-700 font-medium">Loading...</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-linear-to-r from-orange-400 to-orange-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold">{appointments.length}</p>
                </div>
                <svg className="h-12 w-12 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <div className="bg-linear-to-r from-green-400 to-green-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Accepted</p>
                  <p className="text-3xl font-bold">{acceptedAppointments.length}</p>
                </div>
                <svg className="h-12 w-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <div className="bg-linear-to-r from-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total</p>
                  <p className="text-3xl font-bold">{appointments.length + acceptedAppointments.length}</p>
                </div>
                <svg className="h-12 w-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            
            <div className="bg-linear-to-r from-purple-400 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Active</p>
                  <p className="text-3xl font-bold">{activeTab === 'pending' ? appointments.length : acceptedAppointments.length}</p>
                </div>
                <svg className="h-12 w-12 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200 bg-gray-50/50">
              <nav className="flex space-x-8 px-6 sm:px-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === 'pending'
                      ? 'border-orange-500 text-orange-600 bg-orange-50/50 rounded-t-lg'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Pending Appointments</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === 'pending' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {appointments.length}
                    </span>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('accepted')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === 'accepted'
                      ? 'border-green-500 text-green-600 bg-green-50/50 rounded-t-lg'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Accepted Appointments</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === 'accepted' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {acceptedAppointments.length}
                    </span>
                  </div>
                </button>
              </nav>
            </div>

            {/* Content Area */}
            <div className="p-6 sm:p-8">
              <PaginationControls
                itemsPerPage={itemsPerPage}
                handleItemsPerPageChange={handleItemsPerPageChange}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />

              <AppointmentList
                activeTab={activeTab}
                appointments={appointments}
                acceptedAppointments={acceptedAppointments}
                getPaginatedData={getPaginatedData}
                isLoading={isLoading}
                openRejectModal={openRejectModal}
                openAcceptModal={openAcceptModal}
                openRescheduleModal={openRescheduleModal}
                openCompleteModal={openCompleteModal}
                parseServices={parseServices}
                parseServicesFormatted={parseServicesFormatted}
                parseAcTypes={parseAcTypes}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        <AppointmentModals
          isConfirmModalOpen={isConfirmModalOpen}
          isAcceptModalOpen={isAcceptModalOpen}
          isCompleteModalOpen={isCompleteModalOpen}
          isRescheduleModalOpen={isRescheduleModalOpen}
          selectedAppointmentId={selectedAppointmentId}
          selectedService={selectedService}
          newServiceDate={newServiceDate}
          setNewServiceDate={setNewServiceDate}
          customTechnicianInput={customTechnicianInput}
          setCustomTechnicianInput={setCustomTechnicianInput}
          selectedTechnicians={selectedTechnicians}
          availableTechnicians={availableTechnicians}
          isLoading={isLoading}
          handleConfirmReject={handleConfirmReject}
          handleCancelModal={handleCancelModal}
          handleAcceptAppointment={handleAcceptAppointment}
          handleTechnicianSelect={handleTechnicianSelect}
          handleCustomTechnicianKeyPress={handleCustomTechnicianKeyPress}
          addCustomTechnician={addCustomTechnician}
          removeTechnician={removeTechnician}
          confirmReschedule={confirmReschedule}
          completeAppointment={completeAppointment}
        />
      </div>
    </PageWrapper>
  );
};

export default AdminAppointments;