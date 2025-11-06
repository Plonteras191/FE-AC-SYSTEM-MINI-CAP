import { FaCheckCircle, FaClock, FaBan, FaCalendarAlt } from 'react-icons/fa';
import TechniciansList from './TechniciansList.tsx';

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
  status?: string;
  technicians?: string[];
}

interface CurrentPage {
  completed: number;
  pending: number;
  rejected: number;
}

interface AppointmentReportsProps {
  activeTab: string;
  completeAppointments: Appointment[];
  pendingAppointments: Appointment[];
  acceptedAppointments: Appointment[];
  rejectedAppointments: Appointment[];
  paginatedCompletedAppointments: Appointment[];
  paginatedPendingAppointments: Appointment[];
  paginatedRejectedAppointments: Appointment[];
  parseServices: (servicesStr: string) => Service[];
  getAppointmentDate: (appointment: Appointment) => string;
  currentPage: CurrentPage;
  getTotalPages: (totalItems: number) => number;
  handlePageChange: (section: keyof CurrentPage, page: number) => void;
  setActiveTab: (tab: string) => void;
}

const AppointmentReports = ({
  activeTab,
  completeAppointments,
  pendingAppointments,
  acceptedAppointments,
  rejectedAppointments,
  paginatedCompletedAppointments,
  paginatedPendingAppointments,
  paginatedRejectedAppointments,
  parseServices,
  getAppointmentDate,
  currentPage,
  getTotalPages,
  handlePageChange,
  setActiveTab
}: AppointmentReportsProps) => {
  return (
    <>
      {activeTab === 'overview' && (
        <div className="reports-grid">
          {/* Completed Appointments */}
          <div className="report-box complete">
            <h3><FaCheckCircle className="report-icon" /> Completed Appointments</h3>
            <div className="scrollable-content">
              {completeAppointments.length > 0 ? (
                <ul>
                  {completeAppointments.slice(0, 5).map(app => (
                    <li key={app.id} className="appointment-item">
                      <div className="appointment-header">
                        <span className="appointment-id">#{app.id}</span>
                        <span className="appointment-name">{app.name}</span>
                      </div>
                      <div className="appointment-date">
                        <FaCalendarAlt /> {getAppointmentDate(app)}
                      </div>
                    </li>
                  ))}
                  {completeAppointments.length > 5 && (
                    <button className="view-more" onClick={() => setActiveTab('completed')}>
                      View all {completeAppointments.length} appointments
                    </button>
                  )}
                </ul>
              ) : (
                <div className="empty-state">No completed appointments.</div>
              )}
            </div>
          </div>

          {/* Active Appointments */}
          <div className="report-box pending">
            <h3><FaClock className="report-icon" /> Pending/Accepted Appointments</h3>
            <div className="scrollable-content">
              {pendingAppointments.length + acceptedAppointments.length > 0 ? (
                <ul>
                  {[...pendingAppointments, ...acceptedAppointments].slice(0, 5).map(app => (
                    <li key={app.id} className="appointment-item">
                      <div className="appointment-header">
                        <span className="appointment-id">#{app.id}</span>
                        <span className="appointment-name">{app.name}</span>
                        <span className="appointment-status">{app.status || 'Pending'}</span>
                      </div>
                      <div className="appointment-date">
                        <FaCalendarAlt /> {getAppointmentDate(app)}
                      </div>
                    </li>
                  ))}
                  {pendingAppointments.length + acceptedAppointments.length > 5 && (
                    <button className="view-more" onClick={() => setActiveTab('pending')}>
                      View all {pendingAppointments.length + acceptedAppointments.length} appointments
                    </button>
                  )}
                </ul>
              ) : (
                <div className="empty-state">No Pending/Accepted appointments.</div>
              )}
            </div>
          </div>

          {/* Rejected Appointments */}
          <div className="report-box rejected">
            <h3><FaBan className="report-icon" /> Rejected Appointments</h3>
            <div className="scrollable-content">
              {rejectedAppointments.length > 0 ? (
                <ul>
                  {rejectedAppointments.slice(0, 5).map(app => (
                    <li key={app.id} className="appointment-item">
                      <div className="appointment-header">
                        <span className="appointment-id">#{app.id}</span>
                        <span className="appointment-name">{app.name}</span>
                      </div>
                      <div className="appointment-date">
                        <FaCalendarAlt /> {getAppointmentDate(app)}
                      </div>
                    </li>
                  ))}
                  {rejectedAppointments.length > 5 && (
                    <button className="view-more" onClick={() => setActiveTab('rejected')}>
                      View all {rejectedAppointments.length} appointments
                    </button>
                  )}
                </ul>
              ) : (
                <div className="empty-state">No rejected appointments.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detailed views for each appointment type */}
      {activeTab === 'completed' && (
        <AppointmentSection
          title="All Completed Appointments"
          icon={<FaCheckCircle className="report-icon" />}
          appointments={paginatedCompletedAppointments}
          totalAppointments={completeAppointments.length}
          statusBadge="completed"
          currentPage={currentPage.completed}
          getTotalPages={getTotalPages}
          handlePageChange={handlePageChange}
          section="completed"
          parseServices={parseServices}
        />
      )}

      {activeTab === 'pending' && (
        <AppointmentSection
          title="All Active Appointments"
          icon={<FaClock className="report-icon" />}
          appointments={paginatedPendingAppointments}
          totalAppointments={pendingAppointments.length + acceptedAppointments.length}
          statusBadge="pending"
          currentPage={currentPage.pending}
          getTotalPages={getTotalPages}
          handlePageChange={handlePageChange}
          section="pending"
          parseServices={parseServices}
        />
      )}

      {activeTab === 'rejected' && (
        <AppointmentSection
          title="All Rejected Appointments"
          icon={<FaBan className="report-icon" />}
          appointments={paginatedRejectedAppointments}
          totalAppointments={rejectedAppointments.length}
          statusBadge="rejected"
          currentPage={currentPage.rejected}
          getTotalPages={getTotalPages}
          handlePageChange={handlePageChange}
          section="rejected"
          parseServices={parseServices}
        />
      )}
    </>
  );
};

interface AppointmentSectionProps {
  title: string;
  icon: React.ReactElement;
  appointments: Appointment[];
  totalAppointments: number;
  statusBadge: string;
  currentPage: number;
  getTotalPages: (totalItems: number) => number;
  handlePageChange: (section: keyof CurrentPage, page: number) => void;
  section: string;
  parseServices: (servicesStr: string) => Service[];
}

const AppointmentSection = ({
  title,
  icon,
  appointments,
  totalAppointments,
  statusBadge,
  currentPage,
  getTotalPages,
  section,
  parseServices
}: AppointmentSectionProps) => {
  return (
    <div className="full-width-section">
      <h3>{icon} {title}</h3>
      {appointments.length > 0 ? (
        <>
          <div className="appointment-list">
            {appointments.map((app: Appointment) => {
              const services = parseServices(app.services || '');
              return (
                <div key={app.id} className="appointment-card">
                  <div className="appointment-card-header">
                    <span className="appointment-id">#{app.id}</span>
                    <span className={`status-badge ${app.status?.toLowerCase() || statusBadge}`}>
                      {app.status || statusBadge}
                    </span>
                  </div>
                  <div className="appointment-card-body">
                    <h4>{app.name}</h4>
                    <p><strong>Contact:</strong> {app.phone} | {app.email || 'N/A'}</p>
                    <p><strong>Address:</strong> {app.complete_address}</p>
                    <div className="services-list">
                      <p><strong>Services:</strong></p>
                      {services.length > 0 ? (
                        <ul>
                          {services.map((service: Service, idx: number) => (
                            <li key={idx}>
                              {service.type} on {new Date(service.date).toLocaleDateString()} 
                              {service.ac_types && service.ac_types.length > 0 && (
                                <span> | AC Types: {service.ac_types.join(', ')}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No service details available</p>
                      )}
                    </div>
                    <TechniciansList technicians={app.technicians} />
                  </div>
                </div>
              );
            })}
          </div>
          
          {getTotalPages(totalAppointments) > 1 && (
            <div className="pagination-info">
              Page {currentPage} of {getTotalPages(totalAppointments)}
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">No {section} appointments found.</div>
      )}
    </div>
  );
};

export default AppointmentReports;