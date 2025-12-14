import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../services/api.tsx';
import BookingModal from '../components/Admin Booking/bookingModal.tsx';
import RevenueTable from '../components/Admin Revenue/RevenueTable.tsx';
import RevenueFilters from '../components/Admin Revenue/RevenueFilters.tsx';
import RevenueHistoryTable from '../components/Admin Revenue/RevenueHistoryTable.tsx';
import RevenueStats from '../components/Admin Revenue/RevenueStats.tsx';
import RevenuePagination from '../components/Admin Revenue/RevenuePagination.tsx';

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
  technician_names?: string;
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

  // RENDER UI COMPONENTS

  // Render Revenue Management Tab
  const renderRevenueTab = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <RevenueTable
          appointments={appointments}
          revenueData={revenueData}
          totalRevenue={totalRevenue}
          isLoading={isLoading}
          onRevenueChange={handleRevenueChange}
          onSaveRevenue={saveRevenue}
          getServiceInfo={getServiceInfo}
        />
      </div>
    );
  };

  // Render Revenue History Tab
  const renderHistoryTab = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <RevenueFilters
          startDate={startDate}
          endDate={endDate}
          selectedServiceType={selectedServiceType}
          serviceTypes={serviceTypes}
          onStartDateChange={(date) => {
            setStartDate(date);
            setCurrentPage(1);
          }}
          onEndDateChange={(date) => {
            setEndDate(date);
            setCurrentPage(1);
          }}
          onServiceTypeChange={(serviceType) => {
            setSelectedServiceType(serviceType);
            setCurrentPage(1);
          }}
          onClearFilters={clearFilters}
        />
        
        {historyLoading ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading revenue history...</p>
          </div>
        ) : (
          <>
            <RevenueHistoryTable
              history={getCurrentPageItems()}
              totalAmount={totalAmount}
              formatCurrency={formatCurrency}
            />
            
            {history.length > 0 && (
              <RevenuePagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            )}
            
            {history.length > 0 && (
              <RevenueStats
                totalRecords={history.length}
                totalAmount={totalAmount}
                formatCurrency={formatCurrency}
              />
            )}
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