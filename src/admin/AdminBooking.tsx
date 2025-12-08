import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { parseISO, format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import BookingModal from '../components/Admin Booking/bookingModal';
import apiClient from '../services/api';

// Type definitions
interface ServiceDates {
  [service: string]: Date | null;
}

interface ServiceAcTypes {
  [service: string]: string[];
}
import { 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaTools, 
  FaCalendarAlt, 
  FaSnowflake, 
  FaCheckCircle,
  FaClipboardCheck
} from 'react-icons/fa';

const serviceOptions: { [key: string]: string } = {
  cleaning: "Cleaning",
  repair: "Repair",
  installation: "Installation",
  maintenance: "Checkup and Maintenance",
};

const acTypeOptions = [
  "Window Type",
  "Split Type",
  "Portable Type",
  "Floor Standing Type"
];

const AdminBooking = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceDates, setServiceDates] = useState<ServiceDates>({});
  const [serviceAcTypes, setServiceAcTypes] = useState<ServiceAcTypes>({});
  const [globalAvailableDates, setGlobalAvailableDates] = useState<Date[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>("");

  useEffect(() => {
    // Fetch available dates using apiClient
    apiClient.get('/getAvailableDates', {
      params: { 
        global: 1, 
        start: format(new Date(), 'yyyy-MM-dd'),
        end: format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 'yyyy-MM-dd')
      }
    })
      .then(response => {
        // Handle different response structures
        const dateData = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.dates || response.data?.data || []);
        
        if (Array.isArray(dateData)) {
          const dates = dateData.map((dateStr: string) => parseISO(dateStr));
          setGlobalAvailableDates(dates);
        } else {
          console.error("Unexpected response format:", response.data);
          setGlobalAvailableDates([]);
        }
      })
      .catch(err => {
        console.error("Error fetching available dates:", err);
        setGlobalAvailableDates([]);
      });
  }, []);

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedServices(prev => [...prev, value]);
      setServiceDates(prev => ({ ...prev, [value]: null }));
      setServiceAcTypes(prev => ({ ...prev, [value]: [] }));
    } else {
      setSelectedServices(prev => prev.filter(service => service !== value));
      setServiceDates(prev => {
        const newDates = { ...prev };
        delete newDates[value];
        return newDates;
      });
      setServiceAcTypes(prev => {
        const newAcTypes = { ...prev };
        delete newAcTypes[value];
        return newAcTypes;
      });
    }
  };

  const handleACTypeChange = (service: string, acType: string) => {
    setServiceAcTypes(prev => {
      const currentTypes = prev[service] || [];
      if (currentTypes.includes(acType)) {
        // Remove the AC type if it's already selected
        return {
          ...prev,
          [service]: currentTypes.filter((type: string) => type !== acType)
        };
      } else {
        // Add the AC type if it's not already selected
        return {
          ...prev,
          [service]: [...currentTypes, acType]
        };
      }
    });
  };

  const handleServiceDateChange = (service: string, date: Date | null) => {
    setServiceDates(prev => ({ ...prev, [service]: date }));
  };

  const isDateGloballyAvailable = (date: Date | null): boolean => {
    if (!date || globalAvailableDates.length === 0) return true;
    return globalAvailableDates.some((avDate: Date) =>
      avDate.toDateString() === date.toDateString()
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    for (const service of selectedServices) {
      const selectedDate = serviceDates[service];
      if (!selectedDate) {
        alert(`Please select a date for ${serviceOptions[service]}.`);
        return;
      }
      if (!isDateGloballyAvailable(selectedDate)) {
        alert(`The selected date for ${serviceOptions[service]} is no longer available. Please select another date.`);
        return;
      }
      if (!serviceAcTypes[service] || serviceAcTypes[service].length === 0) {
        alert(`Please select at least one AC type for ${serviceOptions[service]}.`);
        return;
      }
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const bookingData = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      completeAddress: formData.get('completeAddress'),
      services: selectedServices.map(service => ({
        type: serviceOptions[service],
        date: serviceDates[service] ? format(serviceDates[service], 'yyyy-MM-dd') : null,
        acTypes: serviceAcTypes[service] || []
      }))
    };

    // Send booking data with apiClient
    apiClient.post('/booking', bookingData)
      .then(response => {
        console.log("Response from backend:", response.data);
        if (response.data.bookingId) {
          // Set the booking reference ID and open the confirmation modal
          setBookingRef(response.data.bookingId);
          setIsConfirmModalOpen(true);
          
          // Reset form after successful submission
          resetForm();
        } else {
          alert("Error saving booking: " + response.data.message);
        }
      })
      .catch(error => {
        console.error("Error saving booking:", error);
        if (error.response && error.response.data && error.response.data.message) {
          alert("Error: " + error.response.data.message);
        } else {
          alert("Error saving booking. Please try again later.");
        }
      });
  };

  // Reset form to initial state
  const resetForm = () => {
    setSelectedServices([]);
    setServiceDates({});
    setServiceAcTypes({});
    // Reset the form element
    const form = document.getElementById("adminBookingForm") as HTMLFormElement;
    if (form) {
      form.reset();
    }
  };

  // Close the modal
  const handleModalClose = () => {
    setIsConfirmModalOpen(false);
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-linear-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
              <FaClipboardCheck className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Create New Booking</h2>
              <p className="text-gray-600 mt-1">Schedule a new service appointment for a customer</p>
            </div>
          </div>
        </div>



        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <form id="adminBookingForm" onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            {/* Customer Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FaUser className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Customer Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700">
                    <FaUser className="h-4 w-4 text-gray-500 mr-2" />
                    Customer Name<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder="Enter customer name" 
                    required 
                    pattern="[A-Za-z ]+" 
                    title="Name should contain only letters and spaces."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700">
                    <FaPhone className="h-4 w-4 text-gray-500 mr-2" />
                    Phone Number<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    placeholder="Enter 11-digit phone number" 
                    required 
                    pattern="^[0-9]{11}$" 
                    title="Phone number must be exactly 11 digits."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700">
                    <FaEnvelope className="h-4 w-4 text-gray-500 mr-2" />
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="Enter customer email (optional)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Service Location Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                <div className="bg-green-100 p-2 rounded-lg">
                  <FaMapMarkerAlt className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Service Location</h3>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="completeAddress" className="flex items-center text-sm font-medium text-gray-700">
                  <FaMapMarkerAlt className="h-4 w-4 text-gray-500 mr-2" />
                  Complete Address<span className="text-red-500 ml-1">*</span>
                </label>
                <input 
                  type="text" 
                  id="completeAddress" 
                  name="completeAddress" 
                  placeholder="Enter customer's complete address" 
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Service Selection Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FaTools className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Service Selection</h3>
                  <p className="text-sm text-gray-600 mt-1">Select one or more services to book</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(serviceOptions).map(([key, label]) => (
                  <label key={key} className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 cursor-pointer">
                    <input 
                      type="checkbox" 
                      value={key} 
                      checked={selectedServices.includes(key)} 
                      onChange={handleServiceChange}
                      className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 text-gray-900 font-medium">{label}</span>
                  </label>
                ))}
              </div>
              
              {selectedServices.length > 0 && (
                <div className="space-y-6">
                  {selectedServices.map(service => (
                    <div key={service} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <FaClipboardCheck className="h-5 w-5 text-orange-600" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">
                          {serviceOptions[service]} Service Details
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700">
                            <FaCalendarAlt className="h-4 w-4 text-gray-500 mr-2" />
                            Date for {serviceOptions[service]}<span className="text-red-500 ml-1">*</span>
                          </label>
                          <DatePicker
                            selected={serviceDates[service]}
                            onChange={(date) => handleServiceDateChange(service, date)}
                            minDate={new Date()}
                            filterDate={isDateGloballyAvailable}
                            placeholderText="Select available date"
                            required
                            dateFormat="yyyy-MM-dd"
                            calendarClassName="custom-calendar"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700">
                            <FaSnowflake className="h-4 w-4 text-gray-500 mr-2" />
                            AC Types for {serviceOptions[service]}<span className="text-red-500 ml-1">*</span>
                          </label>
                          <div className="space-y-2">
                            {acTypeOptions.map(acType => (
                              <label key={`${service}-${acType}`} className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={serviceAcTypes[service]?.includes(acType) || false}
                                  onChange={() => handleACTypeChange(service, acType)}
                                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="ml-3 text-gray-900 font-medium">{acType}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button 
                type="submit"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <FaCheckCircle className="h-5 w-5" />
                <span>Create Booking</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Booking Modal */}
      <BookingModal 
        isOpen={isConfirmModalOpen}
        onClose={handleModalClose}
        title="Booking Confirmation"
      >
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <FaCheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Created Successfully!
            </h3>
            <p className="text-gray-600">
              The booking has been successfully created and saved to the system.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-center space-x-2">
              <FaClipboardCheck className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Reference ID:</span>
              <span className="text-lg font-bold text-blue-600">{bookingRef}</span>
            </div>
          </div>
          
          <button 
            onClick={handleModalClose}
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </BookingModal>
    </div>
  );
};

export default AdminBooking;