// Type definitions for Technician Management

export interface TechnicianWithStats {
    id: number;
    name: string;
    total_jobs: number;
    active_jobs: number;
    completed_jobs: number;
}

export interface TechnicianBooking {
    id: number;
    customer_name: string;
    service_type: string;
    appointment_date: string;
    status: string;
    complete_address: string;
    phone: string;
    email?: string;
}

export interface BookingFilters {
    date_from?: string;
    date_to?: string;
    service_type?: string;
    status?: string;
}

export interface TechnicianFormData {
    name: string;
}
