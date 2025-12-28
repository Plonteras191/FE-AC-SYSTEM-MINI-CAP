import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { techniciansApi } from '../../services/api.tsx';
import type { TechnicianWithStats, TechnicianBooking, BookingFilters } from '../../types/technician';

interface TechnicianDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    technician: TechnicianWithStats;
}

const TechnicianDetailsModal = ({ isOpen, onClose, technician }: TechnicianDetailsModalProps) => {
    const [bookings, setBookings] = useState<TechnicianBooking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<BookingFilters>({});

    useEffect(() => {
        if (isOpen) {
            fetchBookings();
        }
    }, [isOpen, filters]);

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            const response = await techniciansApi.getBookings(technician.id, filters);
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching technician bookings:', error);
            toast.error('Failed to load technician bookings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (key: keyof BookingFilters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value || undefined
        }));
    };

    const clearFilters = () => {
        setFilters({});
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'accepted':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-transparent transition-opacity" onClick={onClose}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl border-4 border-gray-800 transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full z-10">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{technician.name}</h3>
                                    <p className="text-sm text-blue-100">Technician Details & Assigned Jobs</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="bg-white/20 hover:bg-white/30 rounded-lg p-1.5 transition-colors">
                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-xs text-gray-600 font-medium">Total Jobs</p>
                                <p className="text-2xl font-bold text-gray-900">{technician.total_jobs}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-600 font-medium">Active Jobs</p>
                                <p className="text-2xl font-bold text-green-600">{technician.active_jobs}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-600 font-medium">Completed</p>
                                <p className="text-2xl font-bold text-purple-600">{technician.completed_jobs}</p>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white px-6 py-3 border-b border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Date From</label>
                                <input
                                    type="date"
                                    value={filters.date_from || ''}
                                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Date To</label>
                                <input
                                    type="date"
                                    value={filters.date_to || ''}
                                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Service Type</label>
                                <select
                                    value={filters.service_type || ''}
                                    onChange={(e) => handleFilterChange('service_type', e.target.value)}
                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Services</option>
                                    <option value="Installation">Installation</option>
                                    <option value="Repair">Repair</option>
                                    <option value="Checkup and Maintenance">Checkup and Maintenance</option>
                                    <option value="Cleaning">Cleaning</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={filters.status || ''}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        {(filters.date_from || filters.date_to || filters.service_type || filters.status) && (
                            <div className="mt-2 flex items-center justify-between">
                                <div className="flex flex-wrap gap-2">
                                    {filters.date_from && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                            From: {formatDate(filters.date_from)}
                                            <button onClick={() => handleFilterChange('date_from', '')} className="ml-1 hover:text-blue-900">×</button>
                                        </span>
                                    )}
                                    {filters.date_to && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                            To: {formatDate(filters.date_to)}
                                            <button onClick={() => handleFilterChange('date_to', '')} className="ml-1 hover:text-blue-900">×</button>
                                        </span>
                                    )}
                                    {filters.service_type && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                            Service: {filters.service_type}
                                            <button onClick={() => handleFilterChange('service_type', '')} className="ml-1 hover:text-green-900">×</button>
                                        </span>
                                    )}
                                    {filters.status && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                            Status: {filters.status}
                                            <button onClick={() => handleFilterChange('status', '')} className="ml-1 hover:text-purple-900">×</button>
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Content - Bookings Table */}
                    <div className="bg-white px-6 py-3 max-h-96 overflow-y-auto">
                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                                <p className="mt-2 text-sm text-gray-600">Loading bookings...</p>
                            </div>
                        ) : bookings.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">ID</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Service</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {bookings.map((booking, idx) => (
                                            <tr key={`booking-${booking.id}-${booking.service_type}-${idx}`} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">#{booking.id}</td>
                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                    <div>{booking.customer_name}</div>
                                                    <div className="text-xs text-gray-500">{booking.phone}</div>
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900">{booking.service_type}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{formatDate(booking.appointment_date)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <svg className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p className="text-gray-500">No bookings found</p>
                                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-100 px-6 py-2 flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-semibold">{bookings.length}</span> booking(s)
                        </p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechnicianDetailsModal;
