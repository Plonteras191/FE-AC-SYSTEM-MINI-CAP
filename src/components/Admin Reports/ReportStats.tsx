import { FaCheckCircle, FaClock, FaChartLine } from 'react-icons/fa';

interface Appointment {
  id: number | string;
  name: string;
  status?: string;
}

interface ReportStatsProps {
  completeAppointments: Appointment[];
  pendingAppointments: Appointment[];
  acceptedAppointments: Appointment[];
  totalRevenueAmount: number;
  formatCurrency: (amount: number | string) => string;
}

const ReportStats = ({ 
  completeAppointments, 
  pendingAppointments, 
  acceptedAppointments, 
  totalRevenueAmount,
  formatCurrency 
}: ReportStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Completed Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
            <h3 className="text-3xl font-bold text-gray-900">{completeAppointments.length}</h3>
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
            <FaCheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-green-500 h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Pending/Accepted Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">Pending/Accepted</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {pendingAppointments.length + acceptedAppointments.length}
            </h3>
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
            <FaClock className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-yellow-500 h-full rounded-full" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>

      {/* Total Revenue Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold text-blue-600">{formatCurrency(totalRevenueAmount)}</h3>
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
            <FaChartLine className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportStats;