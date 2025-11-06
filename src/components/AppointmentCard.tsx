import { FaCalendar } from 'react-icons/fa';

// Type definitions
interface Service {
  type: string;
  date: string;
  ac_types?: string[];
}

interface Appointment {
  id: number | string;
  name: string;
  phone: string;
  email?: string;
  complete_address: string;
  services?: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  services: Service[];
  openRejectModal: (id: number | string) => void;
  openAcceptModal: (id: number | string) => void;
  openRescheduleModal: (id: number | string, service: Service) => void;
  isLoading: boolean;
}

const AppointmentCard = ({ 
  appointment, 
  services, 
  openRejectModal, 
  openAcceptModal, 
  openRescheduleModal, 
  isLoading 
}: AppointmentCardProps) => {
  return (
    <div className="appointment-card">
      <div className="appointment-info">
        <div className="appointment-field"><strong>ID:</strong> {appointment.id}</div>
        <div className="appointment-field"><strong>Customer:</strong> {appointment.name}</div>
        <div className="appointment-field"><strong>Phone:</strong> {appointment.phone}</div>
        <div className="appointment-field"><strong>Email:</strong> {appointment.email || 'N/A'}</div>
        <div className="appointment-field">
          <strong>Service(s):</strong> 
          {services.length > 0 ? (
            services.map((s: Service, index: number) => (
              <div key={`${appointment.id}-${s.type}-${index}`}>
                {index + 1}. {s.type} on {s.date}
              </div>
            ))
          ) : (
            'N/A'
          )}
        </div>
        <div className="appointment-field">
          <strong>AC Type(s):</strong> 
          {services.length > 0 ? (
            services.map((s: Service, sIndex: number) => (
              <div key={`ac-${appointment.id}-${sIndex}`}>
                {s.ac_types && s.ac_types.length > 0
                  ? s.ac_types.map((ac: string) => `${sIndex + 1}. ${ac}`).join(', ')
                  : 'N/A'}
              </div>
            ))
          ) : (
            'N/A'
          )}
        </div>
        <div className="appointment-field"><strong>Address:</strong> {appointment.complete_address}</div>
      </div>
      <div className="appointment-actions">
        <button 
          className="reject-button" 
          onClick={() => openRejectModal(appointment.id)}
          disabled={isLoading}
        >
          Reject
        </button>
        <button 
          className="accept-button" 
          onClick={() => openAcceptModal(appointment.id)}
          disabled={isLoading}
        >
          Accept
        </button>
        {services.map((service: Service, index: number) => (
          <button
            key={`reschedule-${appointment.id}-${index}`}
            onClick={() => openRescheduleModal(appointment.id, service)}
            className="reschedule-btn"
            title={`Reschedule ${service.type}`}
          >
            <FaCalendar />
          </button>
        ))}
      </div>
    </div>
  );
};

export default AppointmentCard;