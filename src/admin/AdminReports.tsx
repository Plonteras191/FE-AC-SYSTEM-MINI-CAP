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
  services?: string;
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

  // Calculate total filtered revenue
  const filteredTotalRevenue = filteredRevenueHistory.reduce(
    (sum, entry) => sum + parseFloat(String(entry.total_revenue || 0)), 
    0
  );

  // Helper function to parse services JSON string
  const parseServices = (servicesStr: string): Service[] => {
    try {
      return JSON.parse(servicesStr);
    } catch (error) {
      console.error("Error parsing services:", error);
      return [];
    }
  };

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
          `${service.type} on ${new Date(service.date).toLocaleDateString()}${
            service.ac_types && service.ac_types.length > 0 ? 
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
          `${service.type} on ${new Date(service.date).toLocaleDateString()}${
            service.ac_types && service.ac_types.length > 0 ? 
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
        data = completeAppointments;
        filename = 'completed-appointments';
        break;
      case 'pending':
        data = [...pendingAppointments, ...acceptedAppointments];
        filename = 'pending-appointments';
        break;
      case 'cancelled':
        data = cancelledAppointments;
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

  // Get paginated data for each section
  const paginatedCompletedAppointments = getPaginatedData(
    completeAppointments, 
    currentPage.completed
  );
  
  const paginatedPendingAppointments = getPaginatedData(
    [...pendingAppointments, ...acceptedAppointments], 
    currentPage.pending
  );
  
  const paginatedCancelledAppointments = getPaginatedData(
    cancelledAppointments, 
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

          <div className="p-4 sm:p-6 bg-gray-50/50 border-t border-gray-200">
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