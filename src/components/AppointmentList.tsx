import AppointmentCard from './AppointmentCard';

interface AppointmentListProps {
  activeTab: string;
  appointments: any[];
  acceptedAppointments: any[];
  getPaginatedData: () => any[];
  isLoading: boolean;
  openRejectModal: (id: any) => void;
  openAcceptModal: (id: any) => void;
  openRescheduleModal: (id: any, service: any) => void;
  openCompleteModal: (id: any) => void;
  parseServices: (str: string) => any[];
  parseServicesFormatted: (str: string) => string;
  parseAcTypes: (str: string) => string;
}

const AppointmentList = ({ 
  activeTab, 
  appointments, 
  acceptedAppointments, 
  getPaginatedData, 
  isLoading, 
  openRejectModal, 
  openAcceptModal, 
  openRescheduleModal, 
  openCompleteModal,
  parseServices,
  parseServicesFormatted,
  parseAcTypes
}: AppointmentListProps) => {
  return (
    <div className="space-y-6">
      {/* Pending Appointments Cards */}
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
            <div className="grid gap-6">
              {getPaginatedData().map((appt: any) => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  services={parseServices(appt.services)}
                  openRejectModal={openRejectModal}
                  openAcceptModal={openAcceptModal}
                  openRescheduleModal={openRescheduleModal}
                  isLoading={isLoading}
                />
              ))}
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
              {/* Mobile-friendly card view for smaller screens */}
              <div className="block md:hidden">
                <div className="divide-y divide-gray-200">
                  {getPaginatedData().map((appointment: any) => (
                    <div key={appointment.id} className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">#{appointment.id}</h4>
                            <p className="text-sm text-gray-600">{appointment.name}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => openCompleteModal(appointment.id)}
                          disabled={isLoading}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          Complete
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Phone:</span>
                          <p className="text-gray-900">{appointment.phone}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Email:</span>
                          <p className="text-gray-900">{appointment.email || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Services:</span>
                        <p className="text-gray-900 mt-1">
                          {appointment.services ? parseServicesFormatted(appointment.services) : 'N/A'}
                        </p>
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">AC Types:</span>
                        <p className="text-gray-900 mt-1">
                          {appointment.services ? parseAcTypes(appointment.services) : 'N/A'}
                        </p>
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Technicians:</span>
                        <p className="text-gray-900 mt-1">
                          {appointment.technicians && appointment.technicians.length > 0
                            ? appointment.technicians.join(', ')
                            : 'Not assigned'}
                        </p>
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Address:</span>
                        <p className="text-gray-900 mt-1">{appointment.complete_address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop table view */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service(s)</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AC Type(s)</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician(s)</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getPaginatedData().map((appointment: any) => (
                      <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-green-100 p-2 rounded-full mr-3">
                              <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-900">#{appointment.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{appointment.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{appointment.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{appointment.email || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs">
                            {appointment.services ? parseServicesFormatted(appointment.services) : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs">
                            {appointment.services ? parseAcTypes(appointment.services) : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {appointment.technicians && appointment.technicians.length > 0
                              ? appointment.technicians.join(', ')
                              : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Not assigned
                                </span>
                              )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs">{appointment.complete_address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => openCompleteModal(appointment.id)}
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                          >
                            {isLoading ? (
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              'Complete'
                            )}
                          </button>
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
    </div>
  );
};

export default AppointmentList;