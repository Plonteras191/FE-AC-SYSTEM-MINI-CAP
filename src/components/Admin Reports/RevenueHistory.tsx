import { FaMoneyBillWave } from 'react-icons/fa';

interface RevenueEntry {
  revenue_date: string;
  service_types?: string;
  booking_id?: string;
  total_revenue: string | number;
  appointment_dates?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  status_name?: string;
  technician_names?: string;
}

interface CurrentPage {
  completed: number;
  pending: number;
  rejected: number;
  revenue: number;
}

interface RevenueHistoryProps {
  selectedDate: string;
  filteredRevenueHistory: RevenueEntry[];
  paginatedRevenueHistory: RevenueEntry[];
  clearDateFilter: () => void;
  formatCurrency: (amount: string | number) => string;
  filteredTotalRevenue: number;
  currentPage: CurrentPage;
  getTotalPages: (totalItems: number) => number;
}

const RevenueHistory = ({
  selectedDate,
  filteredRevenueHistory,
  paginatedRevenueHistory,
  clearDateFilter,
  formatCurrency,
  filteredTotalRevenue,
  currentPage,
  getTotalPages
}: RevenueHistoryProps) => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
            <FaMoneyBillWave className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Revenue History</h3>
        </div>
        <p className="text-sm text-gray-600 ml-13">
          {selectedDate 
            ? `Viewing revenue for: ${new Date(selectedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}`
            : 'View and track your historical revenue records'
          }
        </p>
      </div>
      
      {/* Content */}
      {filteredRevenueHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-600 text-center mb-4">
            {selectedDate ? 'No revenue records found for the selected date.' : 'No revenue history available.'}
          </p>
          {selectedDate && (
            <button 
              onClick={clearDateFilter}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Clear Filter
            </button>
          )}
          {!selectedDate && (
            <p className="text-sm text-gray-500 mt-2">Revenue records you save will appear here.</p>
          )}
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto -mx-6 px-6 mb-6">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Date Recorded
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Technician(s)
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Service Types
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Appointment Dates
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Total Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedRevenueHistory.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.revenue_date}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <div className="text-gray-900 font-medium">{entry.customer_name}</div>
                          <div className="text-gray-500 text-xs mt-1">
                            {entry.customer_phone}
                            {entry.customer_email && <span className="ml-1">| {entry.customer_email}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            entry.status_name?.toLowerCase() === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : entry.status_name?.toLowerCase() === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {entry.status_name || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {entry.technician_names || 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {entry.service_types ? (
                            <div className="flex flex-wrap gap-1">
                              {entry.service_types.split(', ').map((service: string, i: number) => (
                                <span key={i} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">
                                  {service}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {entry.appointment_dates ? (
                            <div className="space-y-1">
                              {entry.appointment_dates.split(', ').map((date: string, i: number) => (
                                <div key={i} className="text-xs">
                                  {new Date(date).toLocaleDateString()}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-right text-gray-900">
                          {formatCurrency(entry.total_revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {selectedDate ? 'Selected Date Total' : 'All-time Total'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-right text-blue-600">
                        {formatCurrency(filteredTotalRevenue)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="text-sm font-medium text-gray-600 mb-1">
                {selectedDate ? 'Filtered Records' : 'Total Records'}
              </div>
              <div className="text-2xl font-bold text-gray-900">{filteredRevenueHistory.length}</div>
            </div>
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="text-sm font-medium text-gray-600 mb-1">
                {selectedDate ? 'Filtered Revenue' : 'All-time Revenue'}
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(filteredTotalRevenue)}
              </div>
            </div>
          </div>
          
          {/* Pagination Info */}
          {getTotalPages(filteredRevenueHistory.length) > 1 && (
            <div className="text-center text-sm text-gray-600">
              Page {currentPage.revenue} of {getTotalPages(filteredRevenueHistory.length)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RevenueHistory;