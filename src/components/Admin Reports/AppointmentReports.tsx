import { useState } from 'react';
import { FaCheckCircle, FaClock, FaBan, FaCalendarAlt } from 'react-icons/fa';
import AppointmentDetailsModal from '../Admin Appointments/AppointmentDetailsModal';
import type { Appointment } from '../../types/appointment';

// Type definitions
interface Service {
  type: string;
  date: string;
  ac_types?: string[];
}



interface CurrentPage {
  completed: number;
  pending: number;
  cancelled: number;
}

interface AppointmentReportsProps {
  activeTab: string;
  completeAppointments: Appointment[];
  pendingAppointments: Appointment[];
  acceptedAppointments: Appointment[];
  cancelledAppointments: Appointment[];
  paginatedCompletedAppointments: Appointment[];
  paginatedPendingAppointments: Appointment[];
  paginatedCancelledAppointments: Appointment[];
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
  cancelledAppointments,
  paginatedCompletedAppointments,
  paginatedPendingAppointments,
  paginatedCancelledAppointments,
  parseServices,
  getAppointmentDate,
  currentPage,
  getTotalPages,
  handlePageChange,
  setActiveTab
}: AppointmentReportsProps) => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedAppointment(null);
  };

  // Helper to format services for display
  const formatServicesPreview = (servicesData: string | Service[] | undefined): string => {
    if (!servicesData) return 'N/A';
    try {
      const services = typeof servicesData === 'string' ? parseServices(servicesData) : servicesData;
      return services.map(s => s.type).slice(0, 2).join(', ');
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="p-6">
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Completed Appointments */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
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
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-6 border border-yellow-200">
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

          {/* Cancelled Appointments */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg p-6 border border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                <FaBan className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Cancelled</h3>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {cancelledAppointments?.length > 0 ? (
                <>
                  {cancelledAppointments.slice(0, 5).map(app => (
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
                  {cancelledAppointments?.length > 5 && (
                    <button
                      onClick={() => setActiveTab('cancelled')}
                      className="w-full mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      View all {cancelledAppointments?.length || 0} appointments
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">No cancelled appointments.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detailed views for each appointment type - Now using tables */}
      {activeTab === 'completed' && (
        <AppointmentTableSection
          title="All Completed Appointments"
          icon={<FaCheckCircle className="h-5 w-5 text-green-600" />}
          appointments={paginatedCompletedAppointments}
          totalAppointments={completeAppointments.length}
          statusBadge="completed"
          currentPage={currentPage.completed}
          getTotalPages={getTotalPages}
          handlePageChange={handlePageChange}
          section="completed"
          formatServicesPreview={formatServicesPreview}
          handleViewDetails={handleViewDetails}
          headerColor="from-green-600 to-green-700"
        />
      )}

      {activeTab === 'pending' && (
        <AppointmentTableSection
          title="All Active Appointments"
          icon={<FaClock className="h-5 w-5 text-yellow-600" />}
          appointments={paginatedPendingAppointments}
          totalAppointments={pendingAppointments.length + acceptedAppointments.length}
          statusBadge="pending"
          currentPage={currentPage.pending}
          getTotalPages={getTotalPages}
          handlePageChange={handlePageChange}
          section="pending"
          formatServicesPreview={formatServicesPreview}
          handleViewDetails={handleViewDetails}
          headerColor="from-yellow-600 to-yellow-700"
        />
      )}

      {activeTab === 'cancelled' && (
        <AppointmentTableSection
          title="All Cancelled Appointments"
          icon={<FaBan className="h-5 w-5 text-red-600" />}
          appointments={paginatedCancelledAppointments}
          totalAppointments={cancelledAppointments.length}
          statusBadge="cancelled"
          currentPage={currentPage.cancelled}
          getTotalPages={getTotalPages}
          handlePageChange={handlePageChange}
          section="cancelled"
          formatServicesPreview={formatServicesPreview}
          handleViewDetails={handleViewDetails}
          headerColor="from-red-600 to-red-700"
        />
      )}

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        appointment={selectedAppointment}
        parseServices={parseServices}
      />
    </div>
  );
};

interface AppointmentTableSectionProps {
  title: string;
  icon: React.ReactElement;
  appointments: Appointment[];
  totalAppointments: number;
  statusBadge: string;
  currentPage: number;
  getTotalPages: (totalItems: number) => number;
  handlePageChange: (section: keyof CurrentPage, page: number) => void;
  section: string;
  formatServicesPreview: (servicesData: string | Service[] | undefined) => string;
  handleViewDetails: (appointment: Appointment) => void;
  headerColor: string;
}

const AppointmentTableSection = ({
  title,
  icon,
  appointments,
  totalAppointments,
  statusBadge,
  currentPage,
  getTotalPages,
  handlePageChange,
  section,
  formatServicesPreview,
  handleViewDetails,
  headerColor
}: AppointmentTableSectionProps) => {
  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${statusBadge === 'completed' ? 'bg-green-100' :
            statusBadge === 'cancelled' ? 'bg-red-100' : 'bg-yellow-100'
            }`}>
            {icon}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
      </div>

      {/* Content */}
      {appointments.length > 0 ? (
        <>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={`bg-gradient-to-r ${headerColor}`}>
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Phone</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Service(s)</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((app: Appointment, idx: number) => (
                    <tr key={app.id} className={`hover:bg-gray-50 transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg shadow-sm ${statusBadge === 'completed' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                            statusBadge === 'cancelled' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                              'bg-gradient-to-br from-yellow-500 to-yellow-600'
                            }`}>
                            {statusBadge === 'completed' ? (
                              <FaCheckCircle className="h-4 w-4 text-white" />
                            ) : statusBadge === 'cancelled' ? (
                              <FaBan className="h-4 w-4 text-white" />
                            ) : (
                              <FaClock className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <span className="ml-3 text-sm font-bold text-gray-900">#{app.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{app.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{app.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {formatServicesPreview(app.services || '')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${(app.status?.toLowerCase() || statusBadge) === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : (app.status?.toLowerCase() || statusBadge) === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : (app.status?.toLowerCase() || statusBadge) === 'accepted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {app.status || statusBadge}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleViewDetails(app)}
                            className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                          >
                            <div className="flex items-center space-x-1">
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>View</span>
                            </div>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {getTotalPages(totalAppointments) > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(section as keyof CurrentPage, currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {getTotalPages(totalAppointments)}
              </span>
              <button
                onClick={() => handlePageChange(section as keyof CurrentPage, currentPage + 1)}
                disabled={currentPage === getTotalPages(totalAppointments)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
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