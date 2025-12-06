import Modal from '../Modal';

interface AppointmentModalsProps {
  isConfirmModalOpen: boolean;
  isAcceptModalOpen: boolean;
  isCompleteModalOpen: boolean;
  isRescheduleModalOpen: boolean;
  selectedAppointmentId: any;
  selectedService: any;
  newServiceDate: string;
  setNewServiceDate: (date: string) => void;
  customTechnicianInput: string;
  setCustomTechnicianInput: (input: string) => void;
  selectedTechnicians: string[];
  availableTechnicians: any[];
  isLoading: boolean;
  handleConfirmReject: () => void;
  handleCancelModal: () => void;
  handleAcceptAppointment: (id: any) => void;
  handleTechnicianSelect: (e: any) => void;
  handleCustomTechnicianKeyPress: (e: any) => void;
  addCustomTechnician: () => void;
  removeTechnician: (name: string) => void;
  confirmReschedule: () => void;
  completeAppointment: (id: any) => void;
}

const AppointmentModals = ({
  isConfirmModalOpen,
  isAcceptModalOpen,
  isCompleteModalOpen,
  isRescheduleModalOpen,
  selectedAppointmentId,
  selectedService,
  newServiceDate,
  setNewServiceDate,
  customTechnicianInput,
  setCustomTechnicianInput,
  selectedTechnicians,
  availableTechnicians,
  isLoading,
  handleConfirmReject,
  handleCancelModal,
  handleAcceptAppointment,
  handleTechnicianSelect,
  handleCustomTechnicianKeyPress,
  addCustomTechnician,
  removeTechnician,
  confirmReschedule,
  completeAppointment
}: AppointmentModalsProps) => {
  return (
    <>
      {/* Reject Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        title="Confirm Rejection"
        message="Are you sure you want to reject this appointment? A notification email will be sent to the customer."
        onConfirm={handleConfirmReject}
        onCancel={handleCancelModal}
        actionType="reject"
      />

      {/* Accept Modal with Technician Assignment */}
      {isAcceptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
              {/* Header */}
              <div className="sm:flex sm:items-start mb-6">
                <div className="mx-auto shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-2xl leading-6 font-bold text-gray-900">Accept Appointment</h3>
                  <div className="mt-2">
                    <p className="text-gray-600">
                      Are you sure you want to accept this appointment? A confirmation email will be sent to the customer.
                    </p>
                  </div>
                </div>
              </div>

              {/* Technician Assignment Section */}
              <div className="space-y-6 mb-8">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Assign Technicians (Optional)
                  </h4>
                  
                  {/* Dropdown for existing technicians */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="technician-select" className="block text-sm font-medium text-gray-700 mb-2">
                        Select from existing technicians:
                      </label>
                      <select 
                        id="technician-select"
                        onChange={handleTechnicianSelect}
                        defaultValue=""
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">-- Select a technician --</option>
                        {availableTechnicians.map((tech: any) => (
                          <option key={tech.id} value={tech.name}>
                            {tech.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Custom technician input */}
                    <div>
                      <label htmlFor="custom-technician" className="block text-sm font-medium text-gray-700 mb-2">
                        Add new technician:
                      </label>
                      <div className="flex space-x-2">
                        <input
                          id="custom-technician"
                          type="text"
                          value={customTechnicianInput}
                          onChange={(e) => setCustomTechnicianInput(e.target.value)}
                          onKeyPress={handleCustomTechnicianKeyPress}
                          placeholder="Enter technician name"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button 
                          type="button"
                          onClick={addCustomTechnician}
                          disabled={!customTechnicianInput.trim()}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Selected technicians display */}
                    {selectedTechnicians.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Selected Technicians:</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedTechnicians.map((name: string, index: number) => (
                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {name}
                              <button 
                                type="button"
                                onClick={() => removeTechnician(name)}
                                className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse space-y-3 sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
                <button 
                  onClick={() => handleAcceptAppointment(selectedAppointmentId)}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-6 py-3 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    'Accept Appointment'
                  )}
                </button>
                <button 
                  onClick={handleCancelModal}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
        </div>
      )}

      {/* Complete Modal */}
      <Modal
        isOpen={isCompleteModalOpen}
        title="Confirm Completion"
        message="Are you sure you want to mark this appointment as completed?"
        onConfirm={() => completeAppointment(selectedAppointmentId)}
        onCancel={handleCancelModal}
        actionType="complete"
      />

      {/* Reschedule Modal */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-8">
              {/* Header */}
              <div className="sm:flex sm:items-start mb-6">
                <div className="mx-auto shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M3 7h18M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-2xl leading-6 font-bold text-gray-900">Reschedule Service</h3>
                  <div className="mt-2">
                    <p className="text-gray-600">
                      Are you sure you want to reschedule this service to the new date? A notification email will be sent to the customer.
                    </p>
                  </div>
                </div>
              </div>

              {/* Reschedule Details */}
              <div className="space-y-6 mb-8">
                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Appointment ID:</span>
                      <span className="text-sm font-semibold text-gray-900">#{selectedAppointmentId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Service:</span>
                      <span className="text-sm font-semibold text-gray-900">{selectedService}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="newServiceDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Select New Date:
                  </label>
                  <input
                    id="newServiceDate"
                    type="date"
                    value={newServiceDate}
                    onChange={(e) => setNewServiceDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Please select a date from today onwards
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse space-y-3 sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
                <button 
                  onClick={confirmReschedule}
                  disabled={isLoading || !newServiceDate}
                  className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-6 py-3 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    'Confirm Reschedule'
                  )}
                </button>
                <button 
                  onClick={handleCancelModal}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
        </div>
      )}
    </>
  );
};

export default AppointmentModals;