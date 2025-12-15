interface Appointment {
  id: number;
  name: string;
  services: string;
  technicians?: string[];
  technician_names?: string[];
}

interface RevenueTableProps {
  appointments: Appointment[];
  revenueData: Record<number, string>;
  totalRevenue: number;
  isLoading: boolean;
  onRevenueChange: (id: number, value: string) => void;
  onSaveRevenue: () => void;
  getServiceInfo: (servicesStr: string) => { service: string; date: string };
}

const RevenueTable = ({
  appointments,
  revenueData,
  totalRevenue,
  isLoading,
  onRevenueChange,
  onSaveRevenue,
  getServiceInfo
}: RevenueTableProps) => {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-5xl">💼</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Completed Appointments</h3>
        <p className="text-gray-600 text-center max-w-md">
          Completed appointments will appear here for revenue tracking.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Table for Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-linear-to-r from-emerald-600 to-emerald-700 text-white">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Service</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Technician(s)</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Revenue (₱)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {appointments.map(appt => {
              const { service, date } = getServiceInfo(appt.services);
              const technicians = appt.technicians || appt.technician_names || [];
              
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
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {technicians.length > 0 ? (
                        technicians.map((tech, i) => (
                          <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {tech}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                      )}
                    </div>
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
                        onChange={(e) => onRevenueChange(appt.id, e.target.value)}
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
          const technicians = appt.technicians || appt.technician_names || [];
          
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
                  <span className="text-xs font-medium text-gray-500 w-20">Technician:</span>
                  <div className="flex flex-wrap gap-1 flex-1">
                    {technicians.length > 0 ? (
                      technicians.map((tech, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </div>
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
                  onChange={(e) => onRevenueChange(appt.id, e.target.value)}
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
            onClick={onSaveRevenue} 
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
  );
};

export default RevenueTable;
