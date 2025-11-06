import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

interface PaginationControlsProps {
  itemsPerPage: number;
  handleItemsPerPageChange: (e: any) => void;
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
    <div>
      <div className="pagination-controls">
        <div className="items-per-page">
          <label htmlFor="itemsPerPage">Items per page: </label>
          <select 
            id="itemsPerPage" 
            value={itemsPerPage} 
            onChange={handleItemsPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="pagination-nav">
          <button 
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            First
          </button>
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            <FaAngleLeft />
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            <FaAngleRight />
          </button>
          <button 
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-button"
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
    <div className="pagination-controls">
      <button 
        onClick={() => onPageChange(section, 1)} 
        disabled={currentPage === 1}
        className="pagination-button"
      >
        First
      </button>
      <button 
        onClick={() => onPageChange(section, currentPage - 1)} 
        disabled={currentPage === 1}
        className="pagination-button"
      >
        <FaAngleLeft />
      </button>
      <span className="pagination-info">
        Page {currentPage} of {totalPages}
      </span>
      <button 
        onClick={() => onPageChange(section, currentPage + 1)} 
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        <FaAngleRight />
      </button>
      <button 
        onClick={() => onPageChange(section, totalPages)} 
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        Last
      </button>
    </div>
  );
};

export default PaginationControls;