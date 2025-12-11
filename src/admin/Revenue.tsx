import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../services/api.tsx';
import BookingModal from '../components/Admin Booking/bookingModal.tsx';

interface Service {
  type: string;
  date: string;
}

interface Appointment {
  id: number;
  name: string;
  services: string;
}

interface RevenueEntry {
  revenue_id?: number;
  booking_id?: string;
  revenue_date: string;
  customer_name?: string;
  service_types?: string;
  total_revenue: string | number;
}

const Revenue = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState<string>('revenue');
  
  // Revenue management states
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [revenueData, setRevenueData] = useState<Record<number, string>>({});
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // Revenue history states
  const [history, setHistory] = useState<RevenueEntry[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);
  
  // Filter states
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  // On mount, load completed appointments from localStorage for revenue tab
  useEffect(() => {
    if (activeTab === 'revenue') {
      const storedAppointments = localStorage.getItem('completedAppointments');
      if (storedAppointments) {
        const parsedAppointments = JSON.parse(storedAppointments);
        setAppointments(parsedAppointments);
      }
    }
  }, [activeTab]);

  // Auto-compute total whenever revenue values change
  useEffect(() => {
    computeTotalRevenue();
  }, [revenueData]);

  // Load revenue history when history tab is active or filters change
  useEffect(() => {
    if (activeTab === 'history') {
      loadRevenueHistory();
    }
  }, [activeTab, currentPage, itemsPerPage, startDate, endDate, selectedServiceType]);

  // Extract unique service types from history data
  useEffect(() => {
    if (history.length > 0) {
      const uniqueServices = new Set<string>();
      history.forEach(entry => {
        if (entry.service_types) {
          entry.service_types.split(', ').forEach(service => {
            uniqueServices.add(service.trim());
          });
        }
      });
      setServiceTypes(Array.from(uniqueServices).sort());
    }
  }, [history]);

  // Calculate pagination
  useEffect(() => {
    if (history.length > 0) {
      setTotalPages(Math.ceil(history.length / itemsPerPage));
    } else {
      setTotalPages(1);
    }
  }, [history, itemsPerPage]);

  // REVENUE MANAGEMENT FUNCTIONS

  const handleRevenueChange = (id: number, value: string): void => {
    // Prevent negative values
    const numValue = parseFloat(value);
    if (value === '' || (numValue >= 0)) {
      setRevenueData(prev => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  // Compute total revenue based on input values
  const computeTotalRevenue = () => {
    let totalRev = 0;

    appointments.forEach(appt => {
      const revenue = parseFloat(revenueData[appt.id] || '0');
      
      if (!isNaN(revenue)) {
        totalRev += revenue;
      }
    });

    setTotalRevenue(totalRev);
  };

  // Extract service info for each appointment
  const getAppointmentServices = (appt: Appointment): string[] => {
    if (!appt.services) return [];
    
    try {
      const services = JSON.parse(appt.services);
      return services.map((s: Service) => s.type);
    } catch (error) {
      console.error("Error parsing services:", error);
      toast.warning("Error parsing service information for appointment ID: " + appt.id);
      return [];
    }
  };

  // Handle closing the success modal
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    // Reset component state after closing modal
    setAppointments([]);
    setRevenueData({});
    setTotalRevenue(0);
    // Switch to history tab to see the newly added record
    setActiveTab('history');
    loadRevenueHistory();
  };

  // Save computed revenue to revenue history via the Laravel backend API
  const saveRevenue = () => {
    // Validate that every appointment has a revenue amount
    const missingInput = appointments.some(appt => {
      const value = revenueData[appt.id];
      return !value || value.toString().trim() === "";
    });

    if (missingInput) {
      toast.error("Please input revenue amount for all appointments before saving.");
      return;
    }

    setIsLoading(true);

    // Create an array of appointment IDs for the revenue record
    const appointmentIds = appointments.map(appt => appt.id);

    // Create appointment details with revenue information
    const appointmentDetails = appointments.map(appt => {
      const revenue = parseFloat(revenueData[appt.id] || '0');
      const services = getAppointmentServices(appt);
      
      return {
        id: appt.id,
        net_revenue: revenue, // This aligns with your controller's expected structure
        service_types: services
      };
    });

    // Create a new revenue record
    const revenueRecord = {
      revenue_date: new Date().toISOString().slice(0, 10), // Format: 'YYYY-MM-DD'
      total_revenue: totalRevenue,
      appointments: appointmentIds,
      appointment_details: appointmentDetails
    };

    // For debugging - log the data being sent
    console.log("Sending revenue data:", revenueRecord);

    // POST the new revenue record to the Laravel backend API endpoint
    apiClient.post('/revenue-history', revenueRecord)
      .then(response => {
        if (response.data.success) {
          // Clear localStorage for completed appointments and set success state
          localStorage.removeItem('completedAppointments');
          // Show success modal instead of just the inline message
          setShowSuccessModal(true);
          setIsLoading(false);
        } else {
          toast.error("Error saving revenue: " + (response.data.error || "Unknown error."));
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error("Error saving revenue:", error);
        toast.error("Error saving revenue. Please try again.");
        setIsLoading(false);
      });
  };

  // Helper function: extract service info from the services JSON string
  const getServiceInfo = (servicesStr: string): {service: string, date: string} => {
    if (!servicesStr) return { service: "N/A", date: "N/A" };
    try {
      const services = JSON.parse(servicesStr);
      if (services.length > 0) {
        const serviceNames = services.map((s: Service) => s.type).join(', ');
        const serviceDates = services.map((s: Service) => s.date).join(', ');
        return { service: serviceNames, date: serviceDates };
      }
    } catch (error) {
      console.error("Error parsing services:", error);
      toast.warning("Error parsing service information");
    }
    return { service: "N/A", date: "N/A" };
  };

  // REVENUE HISTORY FUNCTIONS

  // Load revenue history from the Laravel backend API
  const loadRevenueHistory = () => {
    setHistoryLoading(true);
    
    // Build query parameters
    const params: any = {
      page: currentPage,
      perPage: itemsPerPage
    };
    
    // Add filters if they exist
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    if (selectedServiceType) params.service_type = selectedServiceType;
    
    apiClient.get('/revenue-history', { params })
      .then(response => {
        if (response.data.history) {
          // Ensure we have valid data
          const validHistory = response.data.history.map((entry: any) => ({
            ...entry,
            total_revenue: parseFloat(entry.total_revenue) || 0
          }));
          setHistory(validHistory);
          setTotalAmount(parseFloat(response.data.totalAmount) || 0);
        } else {
          setHistory([]);
          setTotalAmount(0);
        }
        setHistoryLoading(false);
      })
      .catch(error => {
        console.error("Error fetching revenue history:", error);
        toast.error("Error loading revenue history. Please try again.");
        setHistory([]);
        setTotalAmount(0);
        setHistoryLoading(false);
      });
  };

  // Format currency properly with error handling
  const formatCurrency = (amount: string | number): string => {
    // Ensure amount is a number before using toFixed
    const numAmount = Number(amount);
    if (isNaN(numAmount)) {
      return '₱ 0.00'; // Return default value if conversion fails
    }
    return `₱ ${numAmount.toFixed(2)}`;
  };
  
  // Clear all filters
  const clearFilters = (): void => {
    setStartDate('');
    setEndDate('');
    setSelectedServiceType('');
    setCurrentPage(1);
  };

  // Pagination handlers
  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Calculate current page items for pagination
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return history.slice(startIndex, endIndex);
  };

  // Render pagination controls
  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            currentPage === i
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-300'
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Items per page:</span>
          <select 
            value={itemsPerPage} 
            onChange={handleItemsPerPageChange}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            className="px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {startPage > 1 && (
            <>
              <button
                className="px-3 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-emerald-50 border border-gray-300 rounded-lg"
                onClick={() => handlePageChange(1)}
              >
                1
              </button>
              {startPage > 2 && <span className="text-gray-400">...</span>}
            </>
          )}
          
          {pages}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
              <button
                className="px-3 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-emerald-50 border border-gray-300 rounded-lg"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button 
            className="px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    );
  };

  // RENDER UI COMPONENTS

  // Render Revenue Management Tab
  const renderRevenueTab = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-5xl">💼</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Completed Appointments</h3>
            <p className="text-gray-600 text-center max-w-md">
              Completed appointments will appear here for revenue tracking.
            </p>
          </div>
        ) : (
          <>
            {/* Table for Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-linear-to-r from-emerald-600 to-emerald-700 text-white">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Service</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Revenue (₱)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appointments.map(appt => {
                    const { service, date } = getServiceInfo(appt.services);
                    
                    return (
                      <tr key={appt.id} className="hover:bg-emerald-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">#{appt.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900 font-medium">{appt.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{service}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{date}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative flex items-center max-w-xs">
                            <span className="absolute left-3 text-gray-500 font-medium">₱</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              value={revenueData[appt.id] || ''}
                              onChange={(e) => handleRevenueChange(appt.id, e.target.value)}
                              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Cards for Mobile */}
            <div className="md:hidden divide-y divide-gray-200">
              {appointments.map(appt => {
                const { service, date } = getServiceInfo(appt.services);
                
                return (
                  <div key={appt.id} className="p-4 hover:bg-emerald-50 transition-colors duration-150">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-xs font-semibold text-emerald-600 mb-1">ID #{appt.id}</div>
                        <div className="text-base font-semibold text-gray-900">{appt.name}</div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-start">
                        <span className="text-xs font-medium text-gray-500 w-20">Service:</span>
                        <span className="text-sm text-gray-700 flex-1">{service}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-xs font-medium text-gray-500 w-20">Date:</span>
                        <span className="text-sm text-gray-600">{date}</span>
                      </div>
                    </div>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-gray-500 font-medium">₱</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={revenueData[appt.id] || ''}
                        onChange={(e) => handleRevenueChange(appt.id, e.target.value)}
                        className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-base"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Summary Section */}
            <div className="bg-linear-to-r from-emerald-50 to-emerald-100 border-t-2 border-emerald-200 p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <button 
                  onClick={saveRevenue} 
                  disabled={isLoading}
                  className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-3.5 bg-linear-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <span>{isLoading ? 'Saving...' : 'Save Revenue Record'}</span>
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-emerald-700 mb-1">Total Revenue</div>
                    <div className="text-3xl font-bold text-emerald-600">
                      ₱ {totalRevenue.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Render Revenue History Tab
  const renderHistoryTab = () => {
    const hasActiveFilters = startDate || endDate || selectedServiceType;
    
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Filter Section */}
        <div className="bg-gray-50 border-b border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Date Range Filters */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  min={startDate}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
            
            {/* Service Type Filter */}
            <div className="flex-1">
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                Service Type
              </label>
              <select
                id="serviceType"
                value={selectedServiceType}
                onChange={(e) => {
                  setSelectedServiceType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
              >
                <option value="">All Services</option>
                {serviceTypes.map((service, idx) => (
                  <option key={idx} value={service}>{service}</option>
                ))}\n              </select>
            </div>
            
            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 whitespace-nowrap h-fit"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
          
          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-600">Active Filters:</span>
              {startDate && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  From: {new Date(startDate).toLocaleDateString()}
                </span>
              )}
              {endDate && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  To: {new Date(endDate).toLocaleDateString()}
                </span>
              )}
              {selectedServiceType && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Service: {selectedServiceType}
                </span>
              )}
            </div>
          )}
        </div>
        
        {historyLoading ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading revenue history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-5xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Revenue History</h3>
            <p className="text-gray-600 text-center max-w-md">
              Revenue records you save will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-linear-to-r from-emerald-600 to-emerald-700 text-white">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Date Recorded</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Customer Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Service Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Booking ID</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getCurrentPageItems().map((entry, index) => (
                    <tr key={`${entry.revenue_id || entry.booking_id || index}`} className="hover:bg-emerald-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-gray-900">{entry.revenue_date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{entry.customer_name || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {entry.service_types || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">#{entry.booking_id || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-semibold text-emerald-600">{formatCurrency(entry.total_revenue)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-emerald-50 border-t-2 border-emerald-200">
                    <td colSpan={4} className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-gray-700 uppercase">All-time Total</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-bold text-emerald-600">{formatCurrency(totalAmount)}</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
              {getCurrentPageItems().map((entry, index) => (
                <div key={`${entry.revenue_id || entry.booking_id || index}`} className="p-4 hover:bg-emerald-50 transition-colors duration-150">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-600">{entry.revenue_date}</span>
                      </div>
                      <div className="text-base font-semibold text-gray-900 mb-1">{entry.customer_name || 'N/A'}</div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {entry.service_types || 'N/A'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Booking #{entry.booking_id || 'N/A'}</div>
                      <div className="text-lg font-bold text-emerald-600">{formatCurrency(entry.total_revenue)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {renderPagination()}
            
            {/* Summary Cards */}
            <div className="bg-linear-to-r from-emerald-50 to-emerald-100 border-t-2 border-emerald-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Total Records</div>
                      <div className="text-3xl font-bold text-gray-900">{history.length}</div>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">All-time Revenue</div>
                      <div className="text-3xl font-bold text-emerald-600">{formatCurrency(totalAmount)}</div>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Tabs Navigation */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button 
            className={`flex-1 sm:flex-none px-6 py-3 font-semibold rounded-lg transition-all duration-200 ${
              activeTab === 'revenue'
                ? 'bg-emerald-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 shadow-md'
            }`}
            onClick={() => setActiveTab('revenue')}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Revenue Management</span>
            </div>
          </button>
          <button 
            className={`flex-1 sm:flex-none px-6 py-3 font-semibold rounded-lg transition-all duration-200 ${
              activeTab === 'history'
                ? 'bg-emerald-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 shadow-md'
            }`}
            onClick={() => setActiveTab('history')}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Revenue History</span>
            </div>
          </button>
        </div>

        {/* Tab Headers */}
        {activeTab === 'revenue' ? (
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Revenue Management</h2>
            <p className="text-gray-600">Track and manage completed service appointments</p>
          </div>
        ) : (
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Revenue History</h2>
            <p className="text-gray-600">View and track your historical revenue records</p>
          </div>
        )}
        
        {/* Tab Content */}
        {activeTab === 'revenue' ? renderRevenueTab() : renderHistoryTab()}

        {/* Success Modal */}
        <BookingModal
          isOpen={showSuccessModal}
          onClose={closeSuccessModal}
          title="Revenue Saved"
        >
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Revenue Record Saved Successfully!</h3>
            <p className="text-gray-600 mb-2">Your revenue record has been successfully saved to the system.</p>
            <p className="text-xl font-semibold text-emerald-600 mb-6">Total Revenue: ₱ {totalRevenue.toFixed(2)}</p>
            <button 
              className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg"
              onClick={closeSuccessModal}
            >
              OK
            </button>
          </div>
        </BookingModal>
      </div>
    </div>
  );
};

export default Revenue;