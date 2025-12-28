import { useState } from 'react';
import { toast } from 'react-toastify';
import { techniciansApi } from '../../services/api.tsx';
import type { TechnicianFormData } from '../../types/technician';

interface AddTechnicianModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddTechnicianModal = ({ isOpen, onClose, onSuccess }: AddTechnicianModalProps) => {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Please enter a technician name');
            return;
        }

        try {
            setIsSubmitting(true);
            await techniciansApi.create(name.trim());
            toast.success('Technician added successfully');
            setName('');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error adding technician:', error);
            const errorMsg = error.response?.data?.message || 'Failed to add technician';
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
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white">Add New Technician</h3>
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
                                <label htmlFor="tech-name" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Technician Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="tech-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter technician name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={isSubmitting}
                                    autoFocus
                                />
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
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Adding...' : 'Add Technician'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTechnicianModal;
