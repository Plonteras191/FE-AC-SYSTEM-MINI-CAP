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
    <div className="p-6">
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Completed Appointments */}
          <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                <FaCheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Completed</h3>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {completeAppointments.length > 0 ? (
                <>
                  {completeAppointments.slice(0, 5).map(app => (
                    <div key={app.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500">#{app.id}</span>
                        <span className="text-sm font-semibold text-gray-900">{app.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <FaCalendarAlt className="h-3 w-3" />
                        <span>{getAppointmentDate(app)}</span>
                      </div>
                    </div>
                  ))}
                  {completeAppointments.length > 5 && (
                    <button 
                      onClick={() => setActiveTab('completed')}
                      className="w-full mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      View all {completeAppointments.length} appointments
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">No completed appointments.</div>
              )}
            </div>
          </div>

          {/* Active Appointments */}
          <div className="bg-linear-to-br from-yellow-50 to-amber-50 rounded-lg p-6 border border-yellow-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg">
                <FaClock className="h-5 w-5 text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Pending/Accepted</h3>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pendingAppointments.length + acceptedAppointments.length > 0 ? (
                <>
                  {[...pendingAppointments, ...acceptedAppointments].slice(0, 5).map(app => (
                    <div key={app.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500">#{app.id}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{app.name}</span>
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            {app.status || 'Pending'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <FaCalendarAlt className="h-3 w-3" />
                        <span>{getAppointmentDate(app)}</span>
                      </div>
                    </div>
                  ))}
                  {pendingAppointments.length + acceptedAppointments.length > 5 && (
                    <button 
                      onClick={() => setActiveTab('pending')}
                      className="w-full mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      View all {pendingAppointments.length + acceptedAppointments.length} appointments
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">No Pending/Accepted appointments.</div>
              )}
            </div>
          </div>

          {/* Rejected Appointments */}
          <div className="bg-linear-to-br from-red-50 to-rose-50 rounded-lg p-6 border border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                <FaBan className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Rejected</h3>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {rejectedAppointments.length > 0 ? (
                <>
                  {rejectedAppointments.slice(0, 5).map(app => (
                    <div key={app.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500">#{app.id}</span>
                        <span className="text-sm font-semibold text-gray-900">{app.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <FaCalendarAlt className="h-3 w-3" />
                        <span>{getAppointmentDate(app)}</span>
                      </div>
                    </div>
                  ))}
                  {rejectedAppointments.length > 5 && (
                    <button 
                      onClick={() => setActiveTab('rejected')}
                      className="w-full mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      View all {rejectedAppointments.length} appointments
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">No rejected appointments.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detailed views for each appointment type */}
      {activeTab === 'completed' && (
        <AppointmentSection
          title="All Completed Appointments"
          icon={<FaCheckCircle className="h-5 w-5 text-green-600" />}
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
          icon={<FaClock className="h-5 w-5 text-yellow-600" />}
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
          icon={<FaBan className="h-5 w-5 text-red-600" />}
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
    </div>
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
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
            statusBadge === 'completed' ? 'bg-green-100' :
            statusBadge === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'
          }`}>
            {icon}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
      </div>

      {/* Content */}
      {appointments.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {appointments.map((app: Appointment) => {
              const services = parseServices(app.services || '');
              return (
                <div key={app.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {/* Card Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">Appointment #{app.id}</span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      (app.status?.toLowerCase() || statusBadge) === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : (app.status?.toLowerCase() || statusBadge) === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : (app.status?.toLowerCase() || statusBadge) === 'accepted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.status || statusBadge}
                    </span>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    <h4 className="text-lg font-bold text-gray-900">{app.name}</h4>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-gray-700 min-w-20">Contact:</span>
                        <span className="text-gray-600">{app.phone} | {app.email || 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-gray-700 min-w-20">Address:</span>
                        <span className="text-gray-600">{app.complete_address}</span>
                      </div>
                    </div>
                    
                    {/* Services */}
                    <div className="pt-4 border-t border-gray-200">
                      <p className="font-semibold text-gray-700 mb-3 text-sm">Services:</p>
                      {services.length > 0 ? (
                        <ul className="space-y-2">
                          {services.map((service: Service, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm bg-blue-50 p-3 rounded-lg">
                              <span className="text-blue-600 mt-0.5">•</span>
                              <div className="flex-1">
                                <div className="text-gray-900 font-medium">{service.type}</div>
                                <div className="text-gray-600 text-xs mt-1">
                                  {new Date(service.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </div>
                                {service.ac_types && service.ac_types.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {service.ac_types.map((acType, i) => (
                                      <span key={i} className="px-2 py-1 text-xs bg-white border border-blue-200 text-blue-800 rounded">
                                        {acType}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No service details available</p>
                      )}
                    </div>
                    
                    {/* Technicians */}
                    <TechniciansList technicians={app.technicians} />
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Pagination */}
          {getTotalPages(totalAppointments) > 1 && (
            <div className="text-center text-sm text-gray-600 py-4">
              Page {currentPage} of {getTotalPages(totalAppointments)}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No {section} appointments found.</p>
        </div>
      )}
    </>
  );
};

export default AppointmentReports;