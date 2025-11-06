import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { parseISO, format } from 'date-fns';
import ReCAPTCHA from "react-google-recaptcha";
import "react-datepicker/dist/react-datepicker.css";
import '../styles/DatePickerOverrides.css';
import apiClient from '../services/api';

interface ServiceDates {
  [key: string]: Date | null;
}

interface ServiceAcTypes {
  [key: string]: string[];
}

interface ServiceErrors {
  date?: string;
  acTypes?: string;
}

interface FormErrors {
  services?: {
    [key: string]: ServiceErrors;
  };
}

const serviceOptions: { [key: string]: string } = {
  cleaning: "Cleaning",
  repair: "Repair",
  installation: "Installation",
  maintenance: "Checkup and Maintenance",
};

const acTypeOptions = [
  "Windows",
  "Split"
];

const Booking = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceDates, setServiceDates] = useState<ServiceDates>({});
  const [serviceAcTypes, setServiceAcTypes] = useState<ServiceAcTypes>({});
  const [globalAvailableDates, setGlobalAvailableDates] = useState<Date[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/getAvailableDates', {
      params: { 
        global: 1, 
        start: '2025-01-01', 
        end: '2025-12-31'
      }
    })
      .then(response => {
        const dates = response.data.map((dateStr: string) => parseISO(dateStr));
        setGlobalAvailableDates(dates);
      })
      .catch(err => console.error("Error fetching available dates:", err));
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
        return {
          ...prev,
          [service]: currentTypes.filter(type => type !== acType)
        };
      } else {
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

  const isDateGloballyAvailable = (date: Date) => {
    if (globalAvailableDates.length === 0) return true;
    return globalAvailableDates.some(avDate =>
      avDate.toDateString() === date.toDateString()
    );
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(''); // Clear previous form-level errors

    if (!recaptchaValue) {
      setFormError('Please verify that you are not a robot');
      return;
    }

    let newErrors: FormErrors = { services: {} };
    let hasErrors = false;

    for (const service of selectedServices) {
      const serviceErrors: ServiceErrors = {};

      if (!serviceDates[service]) {
        serviceErrors.date = `Please select a date for ${serviceOptions[service]}.`;
        hasErrors = true;
      } else if (serviceDates[service] && !isDateGloballyAvailable(serviceDates[service] as Date)) {
        serviceErrors.date = `The selected date for ${serviceOptions[service]} is no longer available. Please select another date.`;
        hasErrors = true;
      }

      if (!serviceAcTypes[service] || serviceAcTypes[service].length === 0) {
        serviceErrors.acTypes = `Please select at least one AC type for ${serviceOptions[service]}.`;
        hasErrors = true;
      }

      if (Object.keys(serviceErrors).length > 0) {
        if (!newErrors.services) newErrors.services = {};
        newErrors.services[service] = serviceErrors;
      }
    }

    setErrors(newErrors);

    if (hasErrors) {
      return;
    }
    
    const formData = new FormData(e.target as HTMLFormElement);
    const bookingData = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      completeAddress: formData.get('completeAddress'),
      recaptchaToken: recaptchaValue,
      services: selectedServices.map(service => ({
        type: serviceOptions[service],
        date: serviceDates[service] ? format(serviceDates[service], 'yyyy-MM-dd') : null,
        acTypes: serviceAcTypes[service] || []
      }))
    };

    apiClient.post('/booking', bookingData)      .then(response => {
        console.log("Response from backend:", response.data);
        if (response.data.bookingId) {
          // Reset reCAPTCHA
          recaptchaRef.current?.reset();
          setRecaptchaValue(null);
          navigate('/confirmation', { state: bookingData });
        } else {
          setFormError("Error saving booking: " + response.data.message);
        }
      })
      .catch(error => {
        console.error("Error saving booking:", error);
        setFormError("Error saving booking. Please try again later.");
      });
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Book Your <span className="text-blue-600">AC Service</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Schedule your air conditioning service with our professional technicians. 
            Fast, reliable, and affordable solutions for your comfort.
          </p>
        </div>

        {/* Main Booking Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-slide-up">
          {/* Header Section */}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-8 sm:px-8">
            <div className="flex items-center space-x-4">
              <div className="shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Schedule Your Service</h2>
                <p className="text-blue-100 mt-1">Complete the form below to book your appointment</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            {/* Error Alert */}
            {formError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg animate-fade-in">
                <div className="flex">
                  <div className="shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">{formError}</p>
                  </div>
                </div>
              </div>
            )}
            {/* Step 1: Service Selection */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Service Selection</h3>
                  <p className="text-gray-600 mt-1">Select one or more services that you need</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(serviceOptions).map(([key, label]) => (
                  <label 
                    key={key} 
                    className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
                      selectedServices.includes(key) 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      value={key} 
                      checked={selectedServices.includes(key)} 
                      onChange={handleServiceChange}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        selectedServices.includes(key) 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedServices.includes(key) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{label}</span>
                    </div>
                  </label>
                ))}
              </div>
              
              {/* Service Details */}
              {selectedServices.length > 0 && (
                <div className="space-y-6 animate-fade-in">
                  {selectedServices.map(service => (
                    <div key={service} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {serviceOptions[service]} Service Details
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date Selection */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Date for {serviceOptions[service]}
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <DatePicker
                            selected={serviceDates[service]}
                            onChange={(date) => handleServiceDateChange(service, date)}
                            minDate={new Date()}
                            filterDate={isDateGloballyAvailable}
                            placeholderText="Select available date"
                            required
                            dateFormat="yyyy-MM-dd"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                          {errors.services?.[service]?.date && (
                            <p className="text-red-600 text-sm mt-1 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {errors.services[service].date}
                            </p>
                          )}
                        </div>
                        
                        {/* AC Types */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            AC Types for {serviceOptions[service]}
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {acTypeOptions.map(acType => (
                              <label 
                                key={`${service}-${acType}`}
                                className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all duration-200 hover:shadow-sm ${
                                  serviceAcTypes[service]?.includes(acType) 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                              >
                                <input 
                                  type="checkbox" 
                                  checked={serviceAcTypes[service]?.includes(acType) || false}
                                  onChange={() => handleACTypeChange(service, acType)}
                                  className="sr-only"
                                />
                                <div className="flex items-center space-x-2">
                                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                    serviceAcTypes[service]?.includes(acType) 
                                      ? 'border-blue-500 bg-blue-500' 
                                      : 'border-gray-300'
                                  }`}>
                                    {serviceAcTypes[service]?.includes(acType) && (
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </div>
                                  <span className="font-medium text-gray-800">{acType}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                          {errors.services?.[service]?.acTypes && (
                            <p className="text-red-600 text-sm mt-1 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {errors.services[service].acTypes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Personal Information */}
            {selectedServices.length > 0 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center space-x-4">
                  <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                    <p className="text-gray-600 mt-1">Tell us about yourself</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      placeholder="Enter your full name" 
                      required 
                      pattern="[A-Za-z ]+" 
                      title="Name should contain only letters and spaces."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      placeholder="09123456789" 
                      required 
                      pattern="^[0-9]{11}$" 
                      title="Phone number must be exactly 11 digits."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Service Location */}
            {selectedServices.length > 0 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center space-x-4">
                  <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Service Location</h3>
                    <p className="text-gray-600 mt-1">Where should we perform the service?</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="completeAddress" className="block text-sm font-medium text-gray-700">
                    Complete Address<span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea 
                    id="completeAddress"
                    name="completeAddress"
                    placeholder="Enter your complete address including street, barangay, city, and postal code"
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 resize-none"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Submit Section */}
            {selectedServices.length > 0 && (
              <div className="border-t border-gray-200 pt-8 space-y-6 animate-fade-in">
                <div className="flex justify-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                    onChange={(value: string | null) => setRecaptchaValue(value)}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                  </svg>
                  <span>Schedule Appointment</span>
                </button>
                
                <p className="text-center text-sm text-gray-500">
                  By scheduling an appointment, you agree to our terms of service and privacy policy.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;