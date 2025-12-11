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
    <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-300 hover:shadow-2xl hover:border-orange-400 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-orange-100 to-orange-200 px-6 py-4 border-b-2 border-orange-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-600 p-2 rounded-xl shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">#{appointment.id}</h3>
              <p className="text-orange-700 font-bold">{appointment.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-200 text-orange-900 border-2 border-orange-400">
              Pending Review
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Contact Information */}
        <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-xl p-5 border-2 border-gray-300 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4 flex items-center">
            <svg className="h-4 w-4 mr-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 p-2 rounded-lg shadow-sm">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Phone</p>
                  <p className="text-gray-900 font-semibold mt-0.5">{appointment.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-purple-500 p-2 rounded-lg shadow-sm">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Email</p>
                  <p className="text-gray-900 font-semibold mt-0.5 break-all">{appointment.email || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-green-500 p-2 rounded-lg shadow-sm">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Address</p>
                <p className="text-gray-900 font-semibold leading-relaxed mt-0.5">{appointment.complete_address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider flex items-center">
            <div className="bg-blue-600 p-1.5 rounded-lg mr-2 shadow-md">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            Requested Services ({services.length})
          </h4>
          
          {services.length > 0 ? (
            <div className="space-y-3">
              {services.map((service: Service, index: number) => (
                <div key={`${appointment.id}-${service.type}-${index}`} className="bg-linear-to-r from-blue-100 to-indigo-100 rounded-xl p-4 border-l-4 border-blue-600 shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="bg-blue-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md">{index + 1}</span>
                      <span className="font-bold text-gray-900 text-base">{service.type}</span>
                    </div>
                    <button
                      onClick={() => openRescheduleModal(appointment.id, service)}
                      className="flex items-center space-x-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs font-medium shadow-sm hover:shadow"
                      title={`Reschedule ${service.type}`}
                    >
                      <span>Reschedule</span>
                      <FaCalendar className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-700 mb-3 bg-white bg-opacity-60 rounded-lg px-3 py-2">
                    <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M3 7h18M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold">Scheduled:</span>
                    <span className="font-medium">{new Date(service.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  
                  {service.ac_types && service.ac_types.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">AC Types:</p>
                      <div className="flex flex-wrap gap-2">
                        {service.ac_types.map((acType: string, acIndex: number) => (
                          <span key={`ac-${index}-${acIndex}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white text-blue-700 border border-blue-200 shadow-sm">
                            {acType}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <svg className="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 font-medium">No services specified</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions Footer */}
      <div className="bg-linear-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600 font-medium">
            <svg className="h-4 w-4 inline mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Review and take action on this appointment
          </p>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => openRejectModal(appointment.id)}
              disabled={isLoading}
              className="group px-5 py-2.5 text-sm font-semibold text-red-700 bg-white border-2 border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cancel</span>
                </div>
              )}
            </button>
            
            <button 
              onClick={() => openAcceptModal(appointment.id)}
              disabled={isLoading}
              className="group px-6 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-green-600 to-green-700 border-2 border-green-600 rounded-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Accept Appointment</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;