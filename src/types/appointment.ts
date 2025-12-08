// Type definitions for appointment management

export interface Service {
  type: string;
  date: string;
  ac_types?: string[];
}

export interface Technician {
  id: number;
  name: string;
}

export type AppointmentStatus = 'pending' | 'accepted' | 'completed';

export interface Appointment {
  id: number | string;
  name: string;
  phone: string;
  email?: string;
  complete_address: string;
  services: string | Service[]; // Can be JSON string or parsed array
  status?: AppointmentStatus;
  technician_names?: string[];
  technicians?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ParsedAppointment extends Omit<Appointment, 'services'> {
  services: Service[];
}

export interface AcceptPayload {
  technician_names: string[];
}

export interface ReschedulePayload {
  service_name: string;
  new_date: string;
}

export interface LoadingStates {
  fetching: boolean;
  accepting: Record<number | string, boolean>;
  completing: Record<number | string, boolean>;
  rejecting: Record<number | string, boolean>;
  rescheduling: Record<number | string, boolean>;
}
