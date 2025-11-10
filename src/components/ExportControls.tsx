import { FaFileCsv, FaFileExcel } from 'react-icons/fa';

interface ExportControlsProps {
  activeTab: string;
  exportData: (format: string) => void;
  selectedDate: string;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearDateFilter: () => void;
}

const ExportControls = ({
  activeTab,
  exportData,
  selectedDate,
  handleDateChange,
  clearDateFilter
}: ExportControlsProps) => {
  if (activeTab === 'overview') return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Export Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button 
          onClick={() => exportData('csv')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          title="Download as CSV"
        >
          <FaFileCsv className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span> CSV
        </button>
        <button 
          onClick={() => exportData('excel')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          title="Download as Excel"
        >
          <FaFileExcel className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span> Excel
        </button>
      </div>
      
      {/* Revenue date filter */}
      {activeTab === 'revenue' && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Filter by date:
          </label>
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              value={selectedDate}
              onChange={handleDateChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {selectedDate && (
              <button 
                onClick={clearDateFilter}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                title="Clear date filter"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportControls;