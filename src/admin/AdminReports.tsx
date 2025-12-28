import { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import apiClient, { appointmentsApi } from '../services/api.tsx';
import ReportStats from '../components/Admin Reports/ReportStats.tsx';
import ReportTabs from '../components/Admin Reports/ReportTabs.tsx';
import RevenueHistory from '../components/Admin Reports/RevenueHistory.tsx';
import AppointmentReports from '../components/Admin Reports/AppointmentReports.tsx';
import ExportControls from '../components/Admin Reports/ExportControls.tsx';

interface Service {
  type: string;
  date: string;
  ac_types?: string[];
}

interface Appointment {
  id: number | string;
  name: string;
  status?: string;
  phone: string;
  email?: string;
  complete_address: string;
  services?: string | Service[];
  technicians?: string[];
}

interface RevenueEntry {
  revenue_date: string;
  service_types?: string;
  booking_id?: string;
  total_revenue: string | number;
}

interface CurrentPage {
  completed: number;
  pending: number;
  cancelled: number;
  revenue: number;
}

const AdminReports = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [revenueHistory, setRevenueHistory] = useState<RevenueEntry[]>([]);
  const [filteredRevenueHistory, setFilteredRevenueHistory] = useState<RevenueEntry[]>([]);
  const [totalRevenueAmount, setTotalRevenueAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState<CurrentPage>({
    completed: 1,
    pending: 1,
    cancelled: 1,
    revenue: 1
  });
  const itemsPerPage = 6;

  // Search and filter states
  const [searchName, setSearchName] = useState<string>('');
  const [filterService, setFilterService] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');

  useEffect(() => {
    setIsLoading(true);

    // Fetch all appointments using the appointments API service
    appointmentsApi.getAll()
      .then(response => {
        let data = response.data;
        if (!Array.isArray(data)) data = [data];
        setAppointments(data);
      })
      .catch(error => {
        console.error("Error fetching appointments:", error);
      });

    // Fetch revenue history from backend
    apiClient.get('/revenue-history')
      .then(response => {
        if (response.data && response.data.history) {
          // Ensure we have valid data
          const validHistory = response.data.history.map((entry: any) => ({
            ...entry,
            total_revenue: parseFloat(entry.total_revenue) || 0
          }));
          setRevenueHistory(validHistory);
          setFilteredRevenueHistory(validHistory); // Initialize with all history
          setTotalRevenueAmount(parseFloat(response.data.totalAmount) || 0);
        } else {
          setRevenueHistory([]);
          setFilteredRevenueHistory([]);
          setTotalRevenueAmount(0);
        }
      })
      .catch(error => {
        console.error("Error fetching revenue history:", error);
        setRevenueHistory([]);
        setFilteredRevenueHistory([]);
        setTotalRevenueAmount(0);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Reset pagination when tab changes
  useEffect(() => {
    setCurrentPage({
      completed: 1,
      pending: 1,
      cancelled: 1,
      revenue: 1
    });
    // Clear filters when changing tabs
    setSearchName('');
    setFilterService('');
    setFilterDate('');
  }, [activeTab]);

  // Filter revenue history when date changes
  useEffect(() => {
    if (!selectedDate) {
      // If no date is selected, show all revenue history
      setFilteredRevenueHistory(revenueHistory);
      return;
    }

    // Filter revenue history based on selected date
    const filtered = revenueHistory.filter(entry => {
      // Extract just the date part for comparison (not time)
      const entryDate = entry.revenue_date.split(' ')[0];
      return entryDate === selectedDate;
    });

    setFilteredRevenueHistory(filtered);
    // Reset revenue pagination when filter changes
    setCurrentPage(prev => ({ ...prev, revenue: 1 }));
  }, [selectedDate, revenueHistory]);

  // Filter appointments based on status
  const completeAppointments = appointments.filter(appt =>
    appt.status && appt.status.toLowerCase() === 'completed'
  );

  const pendingAppointments = appointments.filter(appt =>
    !appt.status || appt.status.toLowerCase() === 'pending'
  );

  const acceptedAppointments = appointments.filter(appt =>
    appt.status && appt.status.toLowerCase() === 'accepted'
  );

  const cancelledAppointments = appointments.filter(appt =>
    appt.status && appt.status.toLowerCase() === 'cancelled'
  );

  // Helper function to parse services JSON string or return array directly
  const parseServices = (servicesData: string | Service[] | undefined): Service[] => {
    if (!servicesData) return [];
    if (Array.isArray(servicesData)) return servicesData;
    try {
      return JSON.parse(servicesData);
    } catch (error) {
      console.error("Error parsing services:", error);
      return [];
    }
  };

  // Apply search and filters to appointments
  const applyFilters = (appointmentsList: Appointment[]): Appointment[] => {
    return appointmentsList.filter(appointment => {
      // Filter by name (search)
      const matchesName = searchName === '' ||
        appointment.name.toLowerCase().includes(searchName.toLowerCase());

      // Filter by service
      let matchesService = true;
      if (filterService !== '') {
        try {
          const services = parseServices(appointment.services);
          matchesService = services.some(service =>
            service.type.toLowerCase() === filterService.toLowerCase()
          );
        } catch {
          matchesService = false;
        }
      }

      // Filter by date
      let matchesDate = true;
      if (filterDate !== '') {
        try {
          const services = parseServices(appointment.services);
          matchesDate = services.some(service => {
            const serviceDate = new Date(service.date).toISOString().split('T')[0];
            return serviceDate === filterDate;
          });
        } catch {
          matchesDate = false;
        }
      }

      return matchesName && matchesService && matchesDate;
    });
  };

  // Get filtered appointments for each category
  const filteredCompleteAppointments = applyFilters(completeAppointments);
  const filteredPendingAppointments = applyFilters(pendingAppointments);
  const filteredAcceptedAppointments = applyFilters(acceptedAppointments);
  const filteredCancelledAppointments = applyFilters(cancelledAppointments);

  // Get paginated data
  const getPaginatedData = <T,>(data: T[], page: number): T[] => {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  // Get total pages
  const getTotalPages = (totalItems: number): number => {
    return Math.ceil(totalItems / itemsPerPage);
  };

  // Handle page change
  const handlePageChange = (section: keyof CurrentPage, newPage: number): void => {
    setCurrentPage(prev => ({ ...prev, [section]: newPage }));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchName('');
    setFilterService('');
    setFilterDate('');
    setCurrentPage({
      completed: 1,
      pending: 1,
      cancelled: 1,
      revenue: 1
    });
  };

  // Calculate total filtered revenue
  const filteredTotalRevenue = filteredRevenueHistory.reduce(
    (sum, entry) => sum + parseFloat(String(entry.total_revenue || 0)),
    0
  );

  // Helper function to get appointment date from services
  const getAppointmentDate = (appt: Appointment): string => {
    if (!appt.services) return 'N/A';

    try {
      const services = parseServices(appt.services);
      if (services.length > 0 && services[0].date) {
        return new Date(services[0].date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
      return 'N/A';
    } catch {
      return 'N/A';
    }
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

  // Handle date selection
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedDate(e.target.value);
  };

  // Clear date filter
  const clearDateFilter = () => {
    setSelectedDate('');
  };


  // Export data to CSV
  const exportToCSV = (data: any, filename: string): void => {
    const csvData: string[][] = [];

    // Add headers
    if (activeTab === 'revenue') {
      csvData.push(['Date Recorded', 'Service Type', 'Booking ID', 'Total Revenue']);

      // Add data rows - export filtered data
      filteredRevenueHistory.forEach(entry => {
        csvData.push([
          entry.revenue_date,
          entry.service_types || 'N/A',
          entry.booking_id || 'N/A',
          formatCurrency(entry.total_revenue)
        ]);
      });

      // Add total row
      csvData.push(['Total', '', '', formatCurrency(filteredTotalRevenue)]);
    } else {
      // Add appointment headers
      csvData.push(['ID', 'Name', 'Status', 'Contact', 'Email', 'Address', 'Services']);

      // Add appointment data
      (data as Appointment[]).forEach(app => {
        const services = parseServices(app.services || '');
        const servicesText = services.map(service =>
          `${service.type} on ${new Date(service.date).toLocaleDateString()}${service.ac_types && service.ac_types.length > 0 ?
            ` | AC Types: ${service.ac_types.join(', ')}` : ''
          }`
        ).join('; ');

        csvData.push([
          String(app.id),
          app.name,
          app.status || 'Pending',
          app.phone,
          app.email || 'N/A',
          app.complete_address,
          servicesText
        ]);
      });
    }

    // Create CSV string
    const csvString = csvData.map(row => row.join(',')).join('\n');

    // Create a blob and download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export data to Excel
  const exportToExcel = (data: any, filename: string): void => {
    const workbook = XLSX.utils.book_new();
    let worksheet;

    if (activeTab === 'revenue') {
      // Format revenue data for Excel - use filtered data
      const excelData = filteredRevenueHistory.map(entry => ({
        'Date Recorded': entry.revenue_date,
        'Service Type': entry.service_types || 'N/A',
        'Booking ID': entry.booking_id || 'N/A',
        'Total Revenue': formatCurrency(entry.total_revenue)
      }));

      // Add total row
      excelData.push({
        'Date Recorded': 'Total',
        'Service Type': '',
        'Booking ID': '',
        'Total Revenue': formatCurrency(filteredTotalRevenue)
      });

      worksheet = XLSX.utils.json_to_sheet(excelData);
    } else {
      // Format appointment data for Excel
      const excelData = (data as Appointment[]).map(app => {
        const services = parseServices(app.services || '');
        const servicesText = services.map(service =>
          `${service.type} on ${new Date(service.date).toLocaleDateString()}${service.ac_types && service.ac_types.length > 0 ?
            ` | AC Types: ${service.ac_types.join(', ')}` : ''
          }`
        ).join('; ');

        return {
          'ID': app.id,
          'Name': app.name,
          'Status': app.status || 'Pending',
          'Contact': app.phone,
          'Email': app.email || 'N/A',
          'Address': app.complete_address,
          'Services': servicesText
        };
      });

      worksheet = XLSX.utils.json_to_sheet(excelData);
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  // Export current active tab data
  const exportData = (format: string): void => {
    let data;
    let filename;

    switch (activeTab) {
      case 'completed':
        data = filteredCompleteAppointments;
        filename = 'completed-appointments';
        break;
      case 'pending':
        data = [...filteredPendingAppointments, ...filteredAcceptedAppointments];
        filename = 'pending-appointments';
        break;
      case 'cancelled':
        data = filteredCancelledAppointments;
        filename = 'cancelled-appointments';
        break;
      case 'revenue':
        data = filteredRevenueHistory;
        filename = `revenue-history${selectedDate ? '-' + selectedDate : ''}`;
        break;
      default:
        data = appointments;
        filename = 'all-appointments';
    }

    if (format === 'csv') {
      exportToCSV(data, filename);
    } else if (format === 'excel') {
      exportToExcel(data, filename);
    }
  };

  // Get paginated data for each section (using filtered data)
  const paginatedCompletedAppointments = getPaginatedData(
    filteredCompleteAppointments,
    currentPage.completed
  );

  const paginatedPendingAppointments = getPaginatedData(
    filteredPendingAppointments,
    currentPage.pending
  );

  const paginatedCancelledAppointments = getPaginatedData(
    filteredCancelledAppointments,
    currentPage.cancelled
  );

  const paginatedRevenueHistory = getPaginatedData(
    filteredRevenueHistory,
    currentPage.revenue
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading reports data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5 gap-3 sm:gap-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <FaCalendarAlt className="h-5 w-5 text-blue-600" />
              </span>
              Admin Reports
            </h2>
            <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <FaCalendarAlt className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Stats Section */}
        <ReportStats
          completeAppointments={completeAppointments}
          pendingAppointments={pendingAppointments}
          acceptedAppointments={acceptedAppointments}
          totalRevenueAmount={totalRevenueAmount}
          formatCurrency={formatCurrency}
        />

        {/* Tabs and Controls Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <ReportTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <div className="p-4 sm:p-6 bg-gray-50/50 border-t border-gray-200 space-y-4">
            {/* Search and Filter Controls for Appointments */}
            {activeTab !== 'overview' && activeTab !== 'revenue' && (
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search by Name */}
                  <div>
                    <label htmlFor="search-name-reports" className="block text-sm font-medium text-gray-700 mb-2">
                      Search by Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="search-name-reports"
                        value={searchName}
                        onChange={(e) => {
                          setSearchName(e.target.value);
                          setCurrentPage(prev => ({ ...prev, [activeTab]: 1 }));
                        }}
                        placeholder="Customer name..."
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                  </div>

                  {/* Filter by Service */}
                  <div>
                    <label htmlFor="filter-service-reports" className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Service
                    </label>
                    <select
                      id="filter-service-reports"
                      value={filterService}
                      onChange={(e) => {
                        setFilterService(e.target.value);
                        setCurrentPage(prev => ({ ...prev, [activeTab]: 1 }));
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All Services</option>
                      <option value="Installation">Installation</option>
                      <option value="Repair">Repair</option>
                      <option value="Checkup and Maintenance">Checkup and Maintenance</option>
                      <option value="Cleaning">Cleaning</option>
                    </select>
                  </div>

                  {/* Filter by Date */}
                  <div>
                    <label htmlFor="filter-date-reports" className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Date
                    </label>
                    <input
                      type="date"
                      id="filter-date-reports"
                      value={filterDate}
                      onChange={(e) => {
                        setFilterDate(e.target.value);
                        setCurrentPage(prev => ({ ...prev, [activeTab]: 1 }));
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      disabled={searchName === '' && filterService === '' && filterDate === ''}
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-colors text-sm ${searchName === '' && filterService === '' && filterDate === ''
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Clear</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Active Filters Display */}
                {(searchName !== '' || filterService !== '' || filterDate !== '') && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-gray-700">Active filters:</span>
                    {searchName !== '' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        Name: "{searchName}"
                        <button onClick={() => setSearchName('')} className="ml-2 hover:text-blue-900">×</button>
                      </span>
                    )}
                    {filterService !== '' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                        Service: {filterService}
                        <button onClick={() => setFilterService('')} className="ml-2 hover:text-green-900">×</button>
                      </span>
                    )}
                    {filterDate !== '' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                        Date: {new Date(filterDate).toLocaleDateString()}
                        <button onClick={() => setFilterDate('')} className="ml-2 hover:text-purple-900">×</button>
                      </span>
                    )}
                  </div>
                )}

                {/* Results Count */}
                <div className="mt-3 text-sm text-gray-600">
                  {activeTab === 'completed' && (
                    <>Showing <span className="font-semibold">{filteredCompleteAppointments.length}</span> of <span className="font-semibold">{completeAppointments.length}</span> appointments</>
                  )}
                  {activeTab === 'pending' && (
                    <>Showing <span className="font-semibold">{filteredPendingAppointments.length + filteredAcceptedAppointments.length}</span> of <span className="font-semibold">{pendingAppointments.length + acceptedAppointments.length}</span> appointments</>
                  )}
                  {activeTab === 'cancelled' && (
                    <>Showing <span className="font-semibold">{filteredCancelledAppointments.length}</span> of <span className="font-semibold">{cancelledAppointments.length}</span> appointments</>
                  )}
                </div>
              </div>
            )}

            <ExportControls
              activeTab={activeTab}
              exportData={exportData}
              selectedDate={selectedDate}
              handleDateChange={handleDateChange}
              clearDateFilter={clearDateFilter}
            />
          </div>
        </div>

        {/* Reports Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {activeTab === 'revenue' ? (
            <RevenueHistory
              selectedDate={selectedDate}
              filteredRevenueHistory={filteredRevenueHistory}
              paginatedRevenueHistory={paginatedRevenueHistory}
              clearDateFilter={clearDateFilter}
              formatCurrency={formatCurrency}
              filteredTotalRevenue={filteredTotalRevenue}
              currentPage={currentPage}
              getTotalPages={getTotalPages}
            />
          ) : (
            <AppointmentReports
              activeTab={activeTab}
              completeAppointments={completeAppointments}
              pendingAppointments={pendingAppointments}
              acceptedAppointments={acceptedAppointments}
              cancelledAppointments={cancelledAppointments || []}
              paginatedCompletedAppointments={paginatedCompletedAppointments}
              paginatedPendingAppointments={paginatedPendingAppointments}
              paginatedCancelledAppointments={paginatedCancelledAppointments || []}
              parseServices={parseServices}
              getAppointmentDate={getAppointmentDate}
              currentPage={currentPage}
              getTotalPages={getTotalPages}
              handlePageChange={handlePageChange}
              setActiveTab={setActiveTab}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;