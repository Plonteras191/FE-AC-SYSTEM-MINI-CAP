import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PageWrapper from '../components/PageWrapper.tsx';
import { techniciansApi } from '../services/api.tsx';
import type { TechnicianWithStats } from '../types/technician';
import TechnicianDetailsModal from '../components/TechnicianManagement/TechnicianDetailsModal.tsx';
import AddTechnicianModal from '../components/TechnicianManagement/AddTechnicianModal.tsx';
import EditTechnicianModal from '../components/TechnicianManagement/EditTechnicianModal.tsx';

const AdminTechnicians = () => {
    const [technicians, setTechnicians] = useState<TechnicianWithStats[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchName, setSearchName] = useState('');

    // Modal states
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedTechnician, setSelectedTechnician] = useState<TechnicianWithStats | null>(null);

    useEffect(() => {
        fetchTechnicians();
    }, []);

    const fetchTechnicians = async () => {
        try {
            setIsLoading(true);
            const response = await techniciansApi.getAll();
            setTechnicians(response.data);
        } catch (error) {
            console.error('Error fetching technicians:', error);
            toast.error('Failed to load technicians');
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetails = (technician: TechnicianWithStats) => {
        setSelectedTechnician(technician);
        setDetailsModalOpen(true);
    };

    const handleEdit = (technician: TechnicianWithStats) => {
        setSelectedTechnician(technician);
        setEditModalOpen(true);
    };

    const handleDeleteClick = (technician: TechnicianWithStats) => {
        setSelectedTechnician(technician);
        setDeleteConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedTechnician) return;

        try {
            await techniciansApi.delete(selectedTechnician.id);
            toast.success('Technician deleted successfully');
            fetchTechnicians();
            setDeleteConfirmOpen(false);
            setSelectedTechnician(null);
        } catch (error: any) {
            console.error('Error deleting technician:', error);
            const errorMsg = error.response?.data?.message || 'Failed to delete technician';
            toast.error(errorMsg);
        }
    };

    // Filter technicians by search
    const filteredTechnicians = technicians.filter(tech =>
        tech.name.toLowerCase().includes(searchName.toLowerCase())
    );

    if (isLoading) {
        return (
            <PageWrapper>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                        <p className="mt-4 text-lg font-medium text-gray-700">Loading technicians...</p>
                    </div>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="w-full mx-auto space-y-6">
                        {/* Header Section */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">Technician Management</h2>
                                        <p className="text-gray-600 mt-1">Manage technicians and track their assignments</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setAddModalOpen(true)}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Add Technician</span>
                                </button>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm font-medium">Total Technicians</p>
                                        <p className="text-3xl font-bold">{technicians.length}</p>
                                    </div>
                                    <svg className="h-12 w-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm font-medium">Total Active Jobs</p>
                                        <p className="text-3xl font-bold">{technicians.reduce((sum, t) => sum + t.active_jobs, 0)}</p>
                                    </div>
                                    <svg className="h-12 w-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm font-medium">Total Completed</p>
                                        <p className="text-3xl font-bold">{technicians.reduce((sum, t) => sum + t.completed_jobs, 0)}</p>
                                    </div>
                                    <svg className="h-12 w-12 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Card */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                            {/* Search Bar */}
                            <div className="p-6 bg-gray-50/50 border-b border-gray-200">
                                <div className="relative max-w-md">
                                    <input
                                        type="text"
                                        value={searchName}
                                        onChange={(e) => setSearchName(e.target.value)}
                                        placeholder="Search technician by name..."
                                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <svg
                                        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <div className="mt-3 text-sm text-gray-600">
                                    Showing <span className="font-semibold">{filteredTechnicians.length}</span> of{' '}
                                    <span className="font-semibold">{technicians.length}</span> technicians
                                </div>
                            </div>

                            {/* Technicians Table */}
                            <div className="p-6">
                                {filteredTechnicians.length > 0 ? (
                                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Technician Name</th>
                                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Total Jobs</th>
                                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Active Jobs</th>
                                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Completed</th>
                                                        <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {filteredTechnicians.map((tech, idx) => (
                                                        <tr key={`tech-${tech.id}-${idx}`} className={`hover:bg-blue-50 transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-sm">
                                                                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="ml-3 text-sm font-bold text-gray-900">{tech.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="text-sm font-semibold text-gray-900">{tech.total_jobs}</span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                                    {tech.active_jobs}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                                                                    {tech.completed_jobs}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex justify-center space-x-2">
                                                                    <button
                                                                        onClick={() => handleViewDetails(tech)}
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
                                                                        onClick={() => handleEdit(tech)}
                                                                        className="group bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                                                                    >
                                                                        <div className="flex items-center space-x-1">
                                                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                            </svg>
                                                                            <span>Edit</span>
                                                                        </div>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteClick(tech)}
                                                                        className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                                                                    >
                                                                        <div className="flex items-center space-x-1">
                                                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                            </svg>
                                                                            <span>Delete</span>
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
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="bg-blue-50 rounded-2xl p-8 max-w-md mx-auto">
                                            <svg className="h-16 w-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Technicians Found</h3>
                                            <p className="text-gray-600">
                                                {searchName ? 'Try adjusting your search criteria' : 'Add your first technician to get started'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {detailsModalOpen && selectedTechnician && (
                <TechnicianDetailsModal
                    isOpen={detailsModalOpen}
                    onClose={() => {
                        setDetailsModalOpen(false);
                        setSelectedTechnician(null);
                    }}
                    technician={selectedTechnician}
                />
            )}

            {addModalOpen && (
                <AddTechnicianModal
                    isOpen={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    onSuccess={fetchTechnicians}
                />
            )}

            {editModalOpen && selectedTechnician && (
                <EditTechnicianModal
                    isOpen={editModalOpen}
                    onClose={() => {
                        setEditModalOpen(false);
                        setSelectedTechnician(null);
                    }}
                    technician={selectedTechnician}
                    onSuccess={fetchTechnicians}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmOpen && selectedTechnician && (
                <div className="fixed inset-0 z-[9999] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-transparent transition-opacity" onClick={() => setDeleteConfirmOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl border-4 border-gray-800 transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-10">
                            <div className="bg-white px-6 py-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Technician</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete <span className="font-semibold">{selectedTechnician.name}</span>?
                                                {selectedTechnician.active_jobs > 0 && (
                                                    <span className="block mt-2 text-red-600 font-semibold">
                                                        Warning: This technician has {selectedTechnician.active_jobs} active job(s).
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-3 sm:flex sm:flex-row-reverse gap-2">
                                <button
                                    onClick={handleDelete}
                                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setDeleteConfirmOpen(false)}
                                    className="mt-3 sm:mt-0 w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageWrapper>
    );
};

export default AdminTechnicians;
