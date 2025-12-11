import AppointmentCard from '../AppointmentCard';
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
  parseServices: (str: string) => Service[];
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
  openRescheduleModal, 
  openCompleteModal,
  openReturnToPendingModal,
  parseServices,
  parseServicesFormatted,
  parseAcTypes
}: AppointmentListProps) => {
  const isLoading = loadingStates.fetching;
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
              {getPaginatedData().map((appt: Appointment) => (
                <AppointmentCard
                  key={appt.id}
                  appointment={{ ...appt, services: typeof appt.services === 'string' ? appt.services : JSON.stringify(appt.services) }}
                  services={typeof appt.services === 'string' ? parseServices(appt.services) : appt.services}
                  openRejectModal={openRejectModal}
                  openAcceptModal={openAcceptModal}
                  openRescheduleModal={openRescheduleModal}
                  isLoading={loadingStates.fetching}
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
                  {getPaginatedData().map((appointment: Appointment) => (
                    <div key={appointment.id} className="p-5 bg-linear-to-br from-white to-green-50 hover:from-green-50 hover:to-green-100 transition-colors duration-200">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-linear-to-br from-green-500 to-green-600 p-2.5 rounded-xl shadow-lg">
                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-base">#{appointment.id}</h4>
                            <p className="text-sm text-green-700 font-semibold">{appointment.name}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact Info */}
                      <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200 shadow-sm">
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex items-center space-x-2">
                            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-xs font-medium text-gray-600">Phone:</span>
                            <span className="text-sm font-semibold text-gray-900">{appointment.phone}</span>
                          </div>
                          {appointment.email && (
                            <div className="flex items-center space-x-2">
                              <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                              </svg>
                              <span className="text-xs font-medium text-gray-600">Email:</span>
                              <span className="text-sm font-semibold text-gray-900 truncate">{appointment.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Services and AC Types */}
                      <div className="space-y-3 mb-4">
                        <div>
                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Services:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {appointment.services ? (
                              parseServicesFormatted(typeof appointment.services === 'string' ? appointment.services : JSON.stringify(appointment.services)).split(', ').map((service: string, i: number) => (
                                <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                                  {service}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-sm">N/A</span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">AC Types:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {appointment.services ? (
                              parseAcTypes(typeof appointment.services === 'string' ? appointment.services : JSON.stringify(appointment.services)).split(', ').map((acType: string, i: number) => (
                                <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                  {acType}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-sm">N/A</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Technicians */}
                      <div className="mb-4">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Technicians:</span>
                        {appointment.technicians && appointment.technicians.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {appointment.technicians.map((tech: string, i: number) => (
                              <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {tech}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Not assigned
                          </span>
                        )}
                      </div>
                      
                      {/* Address */}
                      <div className="mb-4">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Address:</span>
                        <div className="flex items-start space-x-2 bg-white rounded-lg p-3 border border-gray-200">
                          <svg className="h-4 w-4 text-green-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <p className="text-sm text-gray-900 leading-relaxed">{appointment.complete_address}</p>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex space-x-2 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => openReturnToPendingModal(appointment.id)}
                          disabled={loadingStates.returningToPending[appointment.id]}
                          className="flex-1 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
                        >
                          {loadingStates.returningToPending[appointment.id] ? (
                            <div className="flex items-center justify-center space-x-2">
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Processing...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-1.5">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                              </svg>
                              <span>Return</span>
                            </div>
                          )}
                        </button>
                        <button
                          onClick={() => openCompleteModal(appointment.id)}
                          disabled={loadingStates.completing[appointment.id]}
                          className="flex-1 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
                        >
                          {loadingStates.completing[appointment.id] ? (
                            <div className="flex items-center justify-center space-x-2">
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Processing...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-1.5">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Complete</span>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop table view */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-linear-to-r from-green-600 to-green-700">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Customer</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Contact</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Service(s)</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">AC Type(s)</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Technician(s)</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Address</th>
                      <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getPaginatedData().map((appointment: Appointment, idx: number) => (
                      <tr key={appointment.id} className={`hover:bg-green-50 transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-linear-to-br from-green-500 to-green-600 p-2 rounded-lg shadow-sm">
                              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="ml-3 text-sm font-bold text-gray-900">#{appointment.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <span className="ml-3 text-sm font-semibold text-gray-900">{appointment.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-900">
                              <svg className="h-3.5 w-3.5 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span className="font-medium">{appointment.phone}</span>
                            </div>
                            {appointment.email && (
                              <div className="flex items-center text-xs text-gray-600">
                                <svg className="h-3 w-3 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                                <span className="truncate max-w-[150px]" title={appointment.email}>{appointment.email}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            {appointment.services ? (
                              <div className="flex flex-wrap gap-1.5">
                                {parseServicesFormatted(typeof appointment.services === 'string' ? appointment.services : JSON.stringify(appointment.services)).split(', ').map((service: string, i: number) => (
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
                                {parseAcTypes(typeof appointment.services === 'string' ? appointment.services : JSON.stringify(appointment.services)).split(', ').map((acType: string, i: number) => (
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
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            {appointment.technicians && appointment.technicians.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {appointment.technicians.map((tech: string, i: number) => (
                                  <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                    <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Not assigned
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs line-clamp-2" title={appointment.complete_address}>
                            <svg className="h-3.5 w-3.5 inline mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {appointment.complete_address}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => openReturnToPendingModal(appointment.id)}
                              disabled={loadingStates.returningToPending[appointment.id]}
                              className="group bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                              title="Return to Pending"
                            >
                              {loadingStates.returningToPending[appointment.id] ? (
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <div className="flex items-center space-x-1">
                                  <svg className="h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                  </svg>
                                  <span>Return</span>
                                </div>
                              )}
                            </button>
                            <button
                              onClick={() => openCompleteModal(appointment.id)}
                              disabled={loadingStates.completing[appointment.id]}
                              className="group bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                            >
                              {loadingStates.completing[appointment.id] ? (
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <div className="flex items-center space-x-1">
                                  <svg className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </div>
  );
};

export default AppointmentList;