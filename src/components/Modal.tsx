

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  actionType?: 'reject' | 'accept' | 'complete' | 'returnToPending' | string;
}

const Modal = ({ isOpen, title, message, onConfirm, onCancel, actionType }: ModalProps) => {
  if (!isOpen) return null;
  
  // Determine the correct styling and text for the confirm button based on action type
  const getConfirmButtonConfig = () => {
    switch (actionType) {
      case 'reject':
        return { 
          className: 'w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-6 py-3 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200',
          text: 'Cancel Appointment',
          iconColor: 'text-red-600',
          bgColor: 'bg-red-100'
        };
      case 'accept':
        return { 
          className: 'w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-6 py-3 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200',
          text: 'Accept Appointment',
          iconColor: 'text-green-600',
          bgColor: 'bg-green-100'
        };
      case 'complete':
        return { 
          className: 'w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-6 py-3 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200',
          text: 'Mark as Completed',
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-100'
        };
      case 'returnToPending':
        return { 
          className: 'w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-6 py-3 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200',
          text: 'Return to Pending',
          iconColor: 'text-orange-600',
          bgColor: 'bg-orange-100'
        };
      default:
        return { 
          className: 'w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-6 py-3 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200',
          text: 'Confirm',
          iconColor: 'text-gray-600',
          bgColor: 'bg-gray-100'
        };
    }
  };

  const buttonConfig = getConfirmButtonConfig();
  
  // Determine icon based on action type
  const getModalIcon = () => {
    switch (actionType) {
      case 'reject':
        return (
          <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'accept':
        return (
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'complete':
        return (
          <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'returnToPending':
        return (
          <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L9.732 4c-.77-.833-1.732-.833-2.502 0L.352 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Modal panel */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-8">
          {/* Header */}
          <div className="sm:flex sm:items-start mb-6">
            <div className={`mx-auto shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${buttonConfig.bgColor} sm:mx-0 sm:h-10 sm:w-10`}>
              {getModalIcon()}
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-2xl leading-6 font-bold text-gray-900">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-gray-600">
                  {message}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse space-y-3 sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
            <button 
              onClick={onConfirm}
              className={buttonConfig.className}
            >
              {buttonConfig.text}
            </button>
            <button 
              onClick={onCancel}
              className="w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
    </div>
  );
};

export default Modal;