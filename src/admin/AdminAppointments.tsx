import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PageWrapper from '../components/PageWrapper.tsx';
import { appointmentsApi } from '../services/api.tsx';
import AppointmentList from '../components/Admin Appointments/AppointmentList.tsx';
import AppointmentModals from '../components/Admin Appointments/AppointmentModals.tsx';
import PaginationControls from '../components/Admin Appointments/PaginationControls.tsx';
import type { Service, Technician } from '../types/appointment';
import { 
  useAppointmentData, 
  useAppointmentActions, 
  useServiceParser 
} from '../hooks/useAppointments';

const AdminAppointments = () => {
  // Use custom hooks for data and actions
  const {
    appointments,
    acceptedAppointments,
    loadingStates,
    fetchAppointments,
    setLoadingStates
  } = useAppointmentData();

  const {
    handleReject,
    handleAccept,
    handleComplete,
    handleReschedule,
    handleReturnToPending
  } = useAppointmentActions(fetchAppointments, setLoadingStates);

  const {
    parseServices,
    parseServicesFormatted,
    parseAcTypes
  } = useServiceParser();

  const [availableTechnicians, setAvailableTechnicians] = useState<Technician[]>([]);
  
  // Modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState<boolean>(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState<boolean>(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState<boolean>(false);
  const [isReturnToPendingModalOpen, setIsReturnToPendingModalOpen] = useState<boolean>(false);
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
    fetchAppointments();
    fetchTechnicians();
  }, [fetchAppointments]);

  const fetchTechnicians = async () => {
    try {
      const response = await appointmentsApi.getTechnicians();
      setAvailableTechnicians(response.data);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    }
  };

  // Open modal to cancel appointment
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
  };

  // Open modal to confirm return to pending
  const openReturnToPendingModal = (id: number | string) => {
    setSelectedAppointmentId(id);
    setIsReturnToPendingModalOpen(true);
  };

  // Open modal to reschedule a service
  const openRescheduleModal = (id: number | string, service: Service) => {
    setSelectedAppointmentId(id);
    setSelectedService(service.type);
    const serviceDate = service.date ? new Date(service.date) : new Date();
    const formattedDate = serviceDate.toISOString().split('T')[0];
    setNewServiceDate(formattedDate);
    setIsRescheduleModalOpen(true);
  };

  // Confirm cancellation
  const handleConfirmReject = () => {
    if (selectedAppointmentId !== null) {
      handleReject(selectedAppointmentId);
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
    setIsReturnToPendingModalOpen(false);
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
    e.target.value = '';
  };

  // Remove selected technician
  const removeTechnician = (technicianName: string) => {
    setSelectedTechnicians(prev => prev.filter(name => name !== technicianName));
  };

  // Add custom technician
  const addCustomTechnician = () => {
    const name = customTechnicianInput.trim();
    if (!name) {
      toast.warning("Please enter a technician name");
      return;
    }
    
    if (selectedTechnicians.includes(name)) {
      toast.info("Technician already selected");
      return;
    }
    
    // Add to selected technicians - will be saved to database when appointment is accepted
    setSelectedTechnicians(prev => [...prev, name]);
    setCustomTechnicianInput('');
    toast.success(`"${name}" added to selected technicians`);
  };

  // Handle Enter key for custom technician input
  const handleCustomTechnicianKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTechnician();
    }
  };

  // Accept appointment wrapper
  const handleAcceptAppointment = async (id: number | string) => {
    await handleAccept(id, selectedTechnicians);
    setIsAcceptModalOpen(false);
    setSelectedAppointmentId(null);
    setSelectedTechnicians([]);
    setCustomTechnicianInput('');
  };

  // Complete appointment wrapper
  const completeAppointment = (id: number | string) => {
    handleComplete(id);
    setIsCompleteModalOpen(false);
    setSelectedAppointmentId(null);
  };

  // Confirm reschedule
  const confirmReschedule = async () => {
    if (selectedAppointmentId && selectedService && newServiceDate) {
      await handleReschedule(selectedAppointmentId, selectedService, newServiceDate);
      setIsRescheduleModalOpen(false);
      setSelectedAppointmentId(null);
      setSelectedService(null);
      setNewServiceDate('');
    }
  };

  // Confirm return to pending
  const confirmReturnToPending = () => {
    if (selectedAppointmentId !== null) {
      handleReturnToPending(selectedAppointmentId);
    }
    setIsReturnToPendingModalOpen(false);
    setSelectedAppointmentId(null);
  };

  // Handle tab change with pagination reset
  const handleTabChange = (tab: 'pending' | 'accepted') => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset pagination when switching tabs
  };

  // Pagination handlers
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
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

  // Check if loading any operation
  const isAnyLoading = loadingStates.fetching || 
    Object.values(loadingStates.accepting).some(Boolean) ||
    Object.values(loadingStates.completing).some(Boolean) ||
    Object.values(loadingStates.rejecting).some(Boolean) ||
    Object.values(loadingStates.rescheduling).some(Boolean) ||
    Object.values(loadingStates.returningToPending).some(Boolean);

  return (
    <PageWrapper>
      <div className="w-full h-full bg-linear-to-br from-blue-50 via-white to-purple-50">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="w-full mx-auto space-y-6">
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
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
              {isAnyLoading && (
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
                  onClick={() => handleTabChange('pending')}
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
                  onClick={() => handleTabChange('accepted')}
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
                loadingStates={loadingStates}
                openRejectModal={openRejectModal}
                openAcceptModal={openAcceptModal}
                openRescheduleModal={openRescheduleModal}
                openCompleteModal={openCompleteModal}
                openReturnToPendingModal={openReturnToPendingModal}
                parseServices={parseServices}
                parseServicesFormatted={parseServicesFormatted}
                parseAcTypes={parseAcTypes}
              />
            </div>
          </div>

          {/* Modals */}
          <AppointmentModals
            isConfirmModalOpen={isConfirmModalOpen}
          isAcceptModalOpen={isAcceptModalOpen}
          isCompleteModalOpen={isCompleteModalOpen}
          isRescheduleModalOpen={isRescheduleModalOpen}
          isReturnToPendingModalOpen={isReturnToPendingModalOpen}
          selectedAppointmentId={selectedAppointmentId}
          selectedService={selectedService}
          newServiceDate={newServiceDate}
          setNewServiceDate={setNewServiceDate}
          customTechnicianInput={customTechnicianInput}
          setCustomTechnicianInput={setCustomTechnicianInput}
          selectedTechnicians={selectedTechnicians}
          availableTechnicians={availableTechnicians}
          loadingStates={loadingStates}
          handleConfirmReject={handleConfirmReject}
          handleCancelModal={handleCancelModal}
          handleAcceptAppointment={handleAcceptAppointment}
          handleTechnicianSelect={handleTechnicianSelect}
          handleCustomTechnicianKeyPress={handleCustomTechnicianKeyPress}
          addCustomTechnician={addCustomTechnician}
          removeTechnician={removeTechnician}
          confirmReschedule={confirmReschedule}
          completeAppointment={completeAppointment}
          confirmReturnToPending={confirmReturnToPending}
        />
        </div>
      </div>
      </div>
    </PageWrapper>
  );
};

export default AdminAppointments;