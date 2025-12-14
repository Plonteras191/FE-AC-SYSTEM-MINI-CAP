interface RevenueFiltersProps {
  startDate: string;
  endDate: string;
  selectedServiceType: string;
  serviceTypes: string[];
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onServiceTypeChange: (serviceType: string) => void;
  onClearFilters: () => void;
}

const RevenueFilters = ({
  startDate,
  endDate,
  selectedServiceType,
  serviceTypes,
  onStartDateChange,
  onEndDateChange,
  onServiceTypeChange,
  onClearFilters
}: RevenueFiltersProps) => {
  const hasActiveFilters = startDate || endDate || selectedServiceType;
  
  return (
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
              onChange={(e) => onStartDateChange(e.target.value)}
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
              onChange={(e) => onEndDateChange(e.target.value)}
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
            onChange={(e) => onServiceTypeChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
          >
            <option value="">All Services</option>
            {serviceTypes.map((service, idx) => (
              <option key={idx} value={service}>{service}</option>
            ))}
          </select>
        </div>
        
        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <button
              onClick={onClearFilters}
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
  );
};

export default RevenueFilters;
