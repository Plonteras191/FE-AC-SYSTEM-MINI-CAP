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
      <div className="admin-appointments-container">
        <h2>Admin Appointments</h2>
        {isLoading && <div className="loading-spinner">Loading...</div>}
        
        {/* Tabs */}
        <div className="appointment-tabs">
          <button 
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Appointments ({appointments.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'accepted' ? 'active' : ''}`}
            onClick={() => setActiveTab('accepted')}
          >
            Accepted Appointments ({acceptedAppointments.length})
          </button>
        </div>

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