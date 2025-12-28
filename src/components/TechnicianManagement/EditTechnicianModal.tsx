import { useState } from 'react';
import { toast } from 'react-toastify';
import { techniciansApi } from '../../services/api.tsx';
import type { TechnicianWithStats } from '../../types/technician';

interface EditTechnicianModalProps {
    isOpen: boolean;
    onClose: () => void;
    technician: TechnicianWithStats;
    onSuccess: () => void;
}

const EditTechnicianModal = ({ isOpen, onClose, technician, onSuccess }: EditTechnicianModalProps) => {
    const [name, setName] = useState(technician.name);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Please enter a technician name');
            return;
        }

        if (name.trim() === technician.name) {
            toast.info('No changes made');
            onClose();
            return;
        }

        try {
            setIsSubmitting(true);
            await techniciansApi.update(technician.id, name.trim());
            toast.success('Technician updated successfully');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error updating technician:', error);
            const errorMsg = error.response?.data?.message || 'Failed to update technician';
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-transparent transition-opacity" onClick={onClose}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl border-4 border-gray-800 transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-10">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white">Edit Technician</h3>
                            </div>
                            <button onClick={onClose} className="bg-white/20 hover:bg-white/30 rounded-lg p-1.5 transition-colors">
                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-6 py-4">
                            <div>
                                <label htmlFor="edit-tech-name" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Technician Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="edit-tech-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter technician name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    disabled={isSubmitting}
                                    autoFocus
                                />
                            </div>

                            <div className="mt-3 text-sm text-gray-500">
                                <p>Technician ID: #{technician.id}</p>
                                <p>Total Jobs: {technician.total_jobs}</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-100 px-6 py-3 flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Technician'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditTechnicianModal;
