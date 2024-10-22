import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PaginationComponent = ({
  currentPage,
  totalPages,
  handlePreviousClick,
  handlePageClick,
  handleNextClick,
  getPageNumbers,
}) => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <button
        onClick={handlePreviousClick}
        disabled={currentPage === 1}
        className={`w-10 h-10 flex justify-center items-center bg-white border rounded-lg text-gray-500 hover:bg-gray-200 ${
          currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        <FaChevronLeft />
      </button>
      {getPageNumbers().map((number) => (
        <button
          key={number}
          onClick={() => handlePageClick(number)}
          className={`w-10 h-10 flex justify-center items-center rounded-lg border ${
            number === currentPage
              ? "bg-green-800 text-white"
              : "bg-white text-gray-500 hover:bg-gray-200"
          }`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 flex justify-center items-center bg-white border rounded-lg text-gray-500 hover:bg-gray-200 ${
          currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default PaginationComponent;
