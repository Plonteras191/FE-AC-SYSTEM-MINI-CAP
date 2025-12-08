import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

interface PaginationControlsProps {
  itemsPerPage: number;
  handleItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

const PaginationControls = ({
  itemsPerPage,
  handleItemsPerPageChange,
  currentPage,
  totalPages,
  handlePageChange
}: PaginationControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 p-4 bg-gray-50/50 rounded-xl border border-gray-200">
      {/* Items per page selector */}
      <div className="flex items-center space-x-3">
        <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-700">
          Show:
        </label>
        <select 
          id="itemsPerPage" 
          value={itemsPerPage} 
          onChange={handleItemsPerPageChange}
          className="block w-20 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        <span className="text-sm text-gray-600">per page</span>
      </div>

      {/* Pagination navigation */}
      {totalPages > 1 && (
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200"
          >
            First
          </button>
          
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200"
          >
            <FaAngleLeft className="h-4 w-4" />
          </button>
          
          <div className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-blue-600">Page {currentPage}</span>
            <span className="mx-2 text-gray-400">of</span>
            <span className="text-blue-600">{totalPages}</span>
          </div>
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200"
          >
            <FaAngleRight className="h-4 w-4" />
          </button>
          
          <button 
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200"
          >
            Last
          </button>
        </div>
      )}
    </div>
  );
};

// Simple Pagination component for AppointmentReports and RevenueHistory
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (section: string, page: number) => void;
  section: string;
}

export const Pagination = ({ currentPage, totalPages, onPageChange, section }: PaginationProps) => {
  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <button 
        onClick={() => onPageChange(section, 1)} 
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200"
      >
        First
      </button>
      
      <button 
        onClick={() => onPageChange(section, currentPage - 1)} 
        disabled={currentPage === 1}
        className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200"
      >
        <FaAngleLeft className="h-4 w-4" />
      </button>
      
      <div className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-blue-50 border border-blue-200 rounded-lg">
        <span className="text-blue-600">Page {currentPage}</span>
        <span className="mx-2 text-gray-400">of</span>
        <span className="text-blue-600">{totalPages}</span>
      </div>
      
      <button 
        onClick={() => onPageChange(section, currentPage + 1)} 
        disabled={currentPage === totalPages}
        className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200"
      >
        <FaAngleRight className="h-4 w-4" />
      </button>
      
      <button 
        onClick={() => onPageChange(section, totalPages)} 
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200"
      >
        Last
      </button>
    </div>
  );
};

export default PaginationControls;