import { useState } from 'react';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import type { Appointment, Service, LoadingStates } from '../../types/appointment';

interface AppointmentListProps {
  activeTab: string;
  appointments: Appointment[];
  acceptedAppointments: Appointment[];
  getPaginatedData: () => Appointment[];
  loadingStates: LoadingStates;
  openRejectModal: (id: number | string) => void;
  openAcceptModal: (id: number | string) => void;
  openRescheduleModal: (id: number | string, service: Service) => void;
  openCompleteModal: (id: number | string) => void;
  openReturnToPendingModal: (id: number | string) => void;
  parseServices: (servicesData: string | Service[] | undefined) => Service[];
  parseServicesFormatted: (str: string) => string;
  parseAcTypes: (str: string) => string;
}

const AppointmentList = ({
  activeTab,
  appointments,
  acceptedAppointments,
  getPaginatedData,
  loadingStates,
  openRejectModal,
  openAcceptModal,
  openCompleteModal,
  openReturnToPendingModal,
  parseServices,
  parseServicesFormatted,
  parseAcTypes
}: AppointmentListProps) => {
  const isLoading = loadingStates.fetching;
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

  return (
    <div className="space-y-6">
      {/* Pending Appointments Table */}
      {activeTab === 'pending' && (
        <>
          {appointments.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <div className="bg-orange-50 rounded-2xl p-8 max-w-md mx-auto">
                <svg className="h-16 w-16 text-orange-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M3 7h18M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Appointments</h3>
                <p className="text-gray-600">There are currently no pending appointments to review.</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-orange-600 to-orange-700">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Customer</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Phone</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Service(s)</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">AC Type(s)</th>
                      <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getPaginatedData().map((appointment: Appointment, idx: number) => (
                      <tr key={appointment.id} className={`hover:bg-orange-50 transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg shadow-sm">
                              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="ml-3 text-sm font-bold text-gray-900">#{appointment.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{appointment.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{appointment.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            {appointment.services ? (
                              <div className="flex flex-wrap gap-1.5">
                                {parseServicesFormatted(typeof appointment.services === 'string' ? appointment.services : JSON.stringify(appointment.services)).split(', ').slice(0, 2).map((service: string, i: number) => (
                                  <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                                    {service}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">N/A</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            {appointment.services ? (
                              <div className="flex flex-wrap gap-1.5">
                                {parseAcTypes(typeof appointment.services === 'string' ? appointment.services : JSON.stringify(appointment.services)).split(', ').slice(0, 2).map((acType: string, i: number) => (
                                  <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                    {acType}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">N/A</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(appointment)}
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
                            <button
                              onClick={() => openAcceptModal(appointment.id)}
                              disabled={loadingStates.accepting[appointment.id]}
                              className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                            >
                              {loadingStates.accepting[appointment.id] ? (
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <div className="flex items-center space-x-1">
                                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Accept</span>
                                </div>
                              )}
                            </button>
                            <button
                              onClick={() => openRejectModal(appointment.id)}
                              disabled={loadingStates.rejecting[appointment.id]}
                              className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                            >
                              {loadingStates.rejecting[appointment.id] ? (
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <div className="flex items-center space-x-1">
                                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  <span>Cancel</span>
                                </div>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Accepted Appointments Table */}
      {activeTab === 'accepted' && (
        <>
          {acceptedAppointments.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <div className="bg-green-50 rounded-2xl p-8 max-w-md mx-auto">
                <svg className="h-16 w-16 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Accepted Appointments</h3>
                <p className="text-gray-600">There are currently no accepted appointments awaiting completion.</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-green-600 to-green-700">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Customer</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Phone</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Service(s)</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Technician(s)</th>
                      <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getPaginatedData().map((appointment: Appointment, idx: number) => (
                      <tr key={appointment.id} className={`hover:bg-green-50 transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg shadow-sm">
                              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="ml-3 text-sm font-bold text-gray-900">#{appointment.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{appointment.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{appointment.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            {appointment.services ? (
                              <div className="flex flex-wrap gap-1.5">
                                {parseServicesFormatted(typeof appointment.services === 'string' ? appointment.services : JSON.stringify(appointment.services)).split(', ').slice(0, 2).map((service: string, i: number) => (
                                  <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                                    {service}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">N/A</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            {appointment.technicians && appointment.technicians.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {appointment.technicians.slice(0, 2).map((tech: string, i: number) => (
                                  <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                                Not assigned
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(appointment)}
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
                            <button
                              onClick={() => openReturnToPendingModal(appointment.id)}
                              disabled={loadingStates.returningToPending[appointment.id]}
                              className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                            >
                              {loadingStates.returningToPending[appointment.id] ? (
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <div className="flex items-center space-x-1">
                                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  <span>Cancel</span>
                                </div>
                              )}
                            </button>
                            <button
                              onClick={() => openCompleteModal(appointment.id)}
                              disabled={loadingStates.completing[appointment.id]}
                              className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                            >
                              {loadingStates.completing[appointment.id] ? (
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <div className="flex items-center space-x-1">
                                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>Complete</span>
                                </div>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
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

export default AppointmentList;