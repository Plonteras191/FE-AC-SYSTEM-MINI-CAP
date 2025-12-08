import { useState, useCallback, useRef, useEffect } from 'react';
import { appointmentsApi } from '../services/api';
import { toast } from 'react-toastify';
import type { Appointment, Service, LoadingStates } from '../types/appointment';

export const useAppointmentData = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [acceptedAppointments, setAcceptedAppointments] = useState<Appointment[]>([]);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    fetching: false,
    accepting: {},
    completing: {},
    rejecting: {},
    rescheduling: {}
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAppointments = useCallback(async () => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoadingStates(prev => ({ ...prev, fetching: true }));
    
    try {
      const response = await appointmentsApi.getAll(abortControllerRef.current.signal);
      let data = response.data;
      if (!Array.isArray(data)) data = [data];
      
      const pending = data.filter((appt: Appointment) => 
        !appt.status || appt.status.toLowerCase() === 'pending'
      );
      setAppointments(pending);
      
      const accepted = data.filter((appt: Appointment) => 
        appt.status && appt.status.toLowerCase() === 'accepted'
      );
      setAcceptedAppointments(accepted);
    } catch (error: any) {
      if (error.name !== 'AbortError' && error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to load appointments");
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, fetching: false }));
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    appointments,
    acceptedAppointments,
    loadingStates,
    fetchAppointments,
    setAppointments,
    setAcceptedAppointments,
    setLoadingStates
  };
};

export const useAppointmentActions = (
  fetchAppointments: () => Promise<void>,
  setLoadingStates: React.Dispatch<React.SetStateAction<LoadingStates>>
) => {
  const handleReject = useCallback(async (id: number | string) => {
    setLoadingStates(prev => ({
      ...prev,
      rejecting: { ...prev.rejecting, [id]: true }
    }));

    try {
      await appointmentsApi.delete(id);
      await fetchAppointments();
      toast.success("Appointment rejected successfully and notification email sent");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Failed to reject appointment");
    } finally {
      setLoadingStates(prev => ({
        ...prev,
        rejecting: { ...prev.rejecting, [id]: false }
      }));
    }
  }, [fetchAppointments, setLoadingStates]);

  const handleAccept = useCallback(async (
    id: number | string, 
    technicianNames: string[]
  ) => {
    setLoadingStates(prev => ({
      ...prev,
      accepting: { ...prev.accepting, [id]: true }
    }));

    try {
      const payload = { technician_names: technicianNames };
      const response = await appointmentsApi.accept(id, payload);
      
      if (response.data?.status?.toLowerCase() === 'accepted') {
        await fetchAppointments();
        toast.success("Appointment accepted and confirmation email sent.");
      }
    } catch (error: any) {
      console.error("Error accepting appointment:", error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to accept appointment");
      }
    } finally {
      setLoadingStates(prev => ({
        ...prev,
        accepting: { ...prev.accepting, [id]: false }
      }));
    }
  }, [fetchAppointments, setLoadingStates]);

  const handleComplete = useCallback(async (id: number | string) => {
    setLoadingStates(prev => ({
      ...prev,
      completing: { ...prev.completing, [id]: true }
    }));

    try {
      const response = await appointmentsApi.complete(id);
      const updatedAppointment = response.data;
      
      // Store completed appointment for revenue tracking
      const stored = localStorage.getItem('completedAppointments');
      const completedAppointments = stored ? JSON.parse(stored) : [];
      
      const exists = completedAppointments.some((app: any) => app.id === updatedAppointment.id);
      if (!exists) {
        completedAppointments.push(updatedAppointment);
        localStorage.setItem('completedAppointments', JSON.stringify(completedAppointments));
      }

      await fetchAppointments();
      toast.success("Appointment marked as completed");
    } catch (error) {
      console.error("Error completing appointment:", error);
      toast.error("Failed to complete appointment");
    } finally {
      setLoadingStates(prev => ({
        ...prev,
        completing: { ...prev.completing, [id]: false }
      }));
    }
  }, [fetchAppointments, setLoadingStates]);

  const handleReschedule = useCallback(async (
    id: number | string,
    serviceName: string,
    newDate: string
  ) => {
    if (!serviceName || !newDate) {
      toast.error('Please select a new date');
      return;
    }

    setLoadingStates(prev => ({
      ...prev,
      rescheduling: { ...prev.rescheduling, [id]: true }
    }));

    const formattedDate = new Date(newDate).toISOString().split('T')[0];
    const payload = { 
      service_name: serviceName, 
      new_date: formattedDate
    };
    
    try {
      const response = await appointmentsApi.reschedule(id, payload);
      if (response.data && !response.data.error) {
        await fetchAppointments();
        toast.success("Service rescheduled successfully");
      } else {
        toast.error(response.data.error || "Failed to reschedule service");
      }
    } catch (error: any) {
      console.error("Error rescheduling service:", error);
      toast.error("Failed to reschedule service");
    } finally {
      setLoadingStates(prev => ({
        ...prev,
        rescheduling: { ...prev.rescheduling, [id]: false }
      }));
    }
  }, [fetchAppointments, setLoadingStates]);

  return {
    handleReject,
    handleAccept,
    handleComplete,
    handleReschedule
  };
};

// Utility hook for parsing services
export const useServiceParser = () => {
  const parseServices = useCallback((servicesStr: string): Service[] => {
    try {
      return JSON.parse(servicesStr);
    } catch (error) {
      console.error("Error parsing services:", error);
      return [];
    }
  }, []);

  const parseServicesFormatted = useCallback((servicesStr: string): string => {
    try {
      const services = JSON.parse(servicesStr);
      return services.map((s: Service, index: number) => 
        `${index + 1}. ${s.type} on ${s.date}`
      ).join(' | ');
    } catch (error) {
      console.error("Error parsing services:", error);
      return 'N/A';
    }
  }, []);

  const parseAcTypes = useCallback((servicesStr: string): string => {
    try {
      const services = JSON.parse(servicesStr);
      return services.map((s: Service, index: number) => {
        if (s.ac_types && s.ac_types.length > 0) {
          return s.ac_types.map((ac: string) => `${index + 1}. ${ac}`).join(', ');
        }
        return 'N/A';
      }).join(' | ');
    } catch (error) {
      console.error("Error parsing AC types:", error);
      return 'N/A';
    }
  }, []);

  return {
    parseServices,
    parseServicesFormatted,
    parseAcTypes
  };
};
