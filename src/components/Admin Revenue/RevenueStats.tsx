interface RevenueStatsProps {
  totalRecords: number;
  totalAmount: number;
  formatCurrency: (amount: string | number) => string;
}

const RevenueStats = ({ totalRecords, totalAmount, formatCurrency }: RevenueStatsProps) => {
  return (
    <div className="bg-linear-to-r from-emerald-50 to-emerald-100 border-t-2 border-emerald-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Total Records</div>
              <div className="text-3xl font-bold text-gray-900">{totalRecords}</div>
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
  );
};

export default RevenueStats;
