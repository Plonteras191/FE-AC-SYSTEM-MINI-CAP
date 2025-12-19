import type { Appointment, Service } from '../../types/appointment';

interface AppointmentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: Appointment | null;
    parseServices: (str: string) => Service[];
}

const AppointmentDetailsModal = ({
    isOpen,
    onClose,
    appointment,
    parseServices
}: AppointmentDetailsModalProps) => {
    if (!isOpen || !appointment) return null;

    const services = typeof appointment.services === 'string'
        ? parseServices(appointment.services)
        : appointment.services;

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 bg-transparent transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                {/* Center modal */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                {/* Modal panel */}
                <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl border-4 border-gray-800 transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full z-10">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white" id="modal-title">
                                        Appointment Details
                                    </h3>
                                    <p className="text-sm text-blue-100">ID: #{appointment.id}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors duration-200"
                            >
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-gray-50 px-6 py-3">
                        <div className="space-y-2">
                            {/* Customer Information */}
                            <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-200">
                                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center">
                                    <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Customer Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</label>
                                        <p className="mt-1 text-sm font-semibold text-gray-900">{appointment.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</label>
                                        <p className="mt-1 text-sm font-semibold text-gray-900">{appointment.phone}</p>
                                    </div>
                                    {appointment.email && (
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                                            <p className="mt-1 text-sm font-semibold text-gray-900">{appointment.email}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Address */}
                            <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-200">
                                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center">
                                    <svg className="h-5 w-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Service Address
                                </h4>
                                <p className="text-sm text-gray-900 leading-relaxed">{appointment.complete_address}</p>
                            </div>

                            {/* Services */}
                            <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-200">
                                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center">
                                    <svg className="h-5 w-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Requested Services
                                </h4>
                                <div className="space-y-2">
                                    {services && services.length > 0 ? (
                                        services.map((service: Service, index: number) => (
                                            <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Service Type</label>
                                                        <p className="mt-1 text-sm font-bold text-blue-900">{service.type}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</label>
                                                        <p className="mt-1 text-sm font-bold text-gray-900">
                                                            {service.date ? new Date(service.date).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            }) : 'Not specified'}
                                                        </p>
                                                    </div>
                                                </div>
                                                {service.ac_types && service.ac_types.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-blue-200">
                                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">AC Types</label>
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {service.ac_types.map((acType: string, i: number) => (
                                                                <span key={i} className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                                                                    {acType}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No services specified</p>
                                    )}
                                </div>
                            </div>

                            {/* Technicians (for accepted appointments) */}
                            {appointment.technicians && appointment.technicians.length > 0 && (
                                <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-200">
                                    <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center">
                                        <svg className="h-5 w-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Assigned Technicians
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {appointment.technicians.map((tech: string, i: number) => (
                                            <span key={i} className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-green-100 text-green-800 border border-green-300">
                                                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Status */}
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center">
                                    <svg className="h-5 w-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Status
                                </h4>
                                <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold ${appointment.status === 'pending'
                                    ? 'bg-orange-100 text-orange-800 border border-orange-300'
                                    : appointment.status === 'accepted'
                                        ? 'bg-green-100 text-green-800 border border-green-300'
                                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                                    }`}>
                                    {appointment.status ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) : 'Unknown'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-100 px-6 py-2">
                        <div className="flex justify-end">
                            <button
                                onClick={onClose}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetailsModal;
