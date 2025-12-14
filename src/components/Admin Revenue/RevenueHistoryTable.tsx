interface RevenueEntry {
  revenue_id?: number;
  booking_id?: string;
  revenue_date: string;
  customer_name?: string;
  service_types?: string;
  total_revenue: string | number;
  technician_names?: string;
}

interface RevenueHistoryTableProps {
  history: RevenueEntry[];
  totalAmount: number;
  formatCurrency: (amount: string | number) => string;
}

const RevenueHistoryTable = ({ history, totalAmount, formatCurrency }: RevenueHistoryTableProps) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-5xl">📊</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Revenue History</h3>
        <p className="text-gray-600 text-center max-w-md">
          Revenue records you save will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-linear-to-r from-emerald-600 to-emerald-700 text-white">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Date Recorded</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Customer Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Technician(s)</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Service Type</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Booking ID</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Total Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {history.map((entry, index) => (
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
                  <span className="text-sm text-gray-700">{entry.technician_names || 'N/A'}</span>
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
        {history.map((entry, index) => (
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
                <div className="text-xs text-gray-600 mb-2">
                  <span className="font-medium">Technician(s):</span> {entry.technician_names || 'N/A'}
                </div>
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
    </>
  );
};

export default RevenueHistoryTable;
