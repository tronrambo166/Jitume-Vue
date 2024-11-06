import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CardsPagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="flex justify-center items-center space-x-2 mt-4">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-10 h-10 flex justify-center items-center border rounded-lg transition duration-200 ${
                    currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
            >
                <FaChevronLeft />
            </button>

            {/* Page Number Buttons */}
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`w-10 h-10 flex justify-center items-center rounded-lg border transition duration-200 ${
                        currentPage === number
                            ? "bg-green-800 text-white"
                            : "bg-white text-gray-500 hover:bg-gray-200"
                    }`}
                >
                    {number}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-10 h-10 flex justify-center items-center border rounded-lg transition duration-200 ${
                    currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
            >
                <FaChevronRight />
            </button>
        </nav>
    );
};

export default CardsPagination;
