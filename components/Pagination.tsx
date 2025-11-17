import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null;
    }

    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 7; // e.g., 1 ... 4 5 6 ... 10

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1); // Always show first page
            if (currentPage > 3) {
                pages.push('...');
            }

            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 2) {
                start = 2;
                end = 4;
            }

            if (currentPage >= totalPages - 1) {
                start = totalPages - 3;
                end = totalPages - 1;
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
            pages.push(totalPages); // Always show last page
        }
        return [...new Set(pages)]; // Remove duplicates that can occur with simple logic
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav className="flex justify-center items-center space-x-1 mt-8 pb-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-white rounded-lg shadow-md hover:bg-slate-100 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                aria-label="Go to previous page"
            >
                Trước
            </button>
            {pageNumbers.map((number, index) =>
                typeof number === 'string' ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-slate-500 self-end">...</span>
                ) : (
                    <button
                        key={number}
                        onClick={() => onPageChange(number)}
                        className={`px-3 py-2 rounded-lg shadow-md font-semibold text-sm w-10 h-10 flex items-center justify-center ${
                            currentPage === number
                                ? 'bg-blue-600 text-white'
                                : 'bg-white hover:bg-slate-100'
                        }`}
                        aria-current={currentPage === number ? 'page' : undefined}
                    >
                        {number}
                    </button>
                )
            )}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-white rounded-lg shadow-md hover:bg-slate-100 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                aria-label="Go to next page"
            >
                Tiếp
            </button>
        </nav>
    );
};

export default Pagination;
