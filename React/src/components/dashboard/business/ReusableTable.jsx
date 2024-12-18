import React, { useState } from "react";

const ReusableTable = ({ headers, data, rowsPerPage = 5, tableId }) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the total number of pages
    const totalPages = Math.ceil(data.length / rowsPerPage);

    // Get current page data
    const currentData = data.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Handle page navigation
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="bg-white rounded-lg p-4 mt-6 mb-4 z-50" id={tableId}>
            <div className="overflow-x-auto sm:overflow-x-visible">
                {" "}
                {/* This ensures horizontal scroll only on mobile */}
                <table
                    className="min-w-full table-auto border-collapse text-left"
                    id="reusable-table"
                >
                    <thead
                        className="bg-gray-100 text-sm text-gray-600"
                        id="table-header"
                    >
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider border-b border-gray-300 ${
                                        header === "Actions" ? "w-2/5" : "w-1/5"
                                    } ${
                                        tableId === "businessTable" &&
                                        header === "Category"
                                            ? "pl-11" // Move Category right only for businessTable
                                            : ""
                                    } ${
                                        tableId === "businessTable" &&
                                        header === "Details"
                                            ? "pl-16" // Move Category right only for businessTable
                                            : ""
                                    } ${
                                        tableId === "businessTable" &&
                                        header === "Amount Required"
                                            ? "pl-9" // Move Category right only for businessTable
                                            : ""
                                    }
                                ${
                                    tableId === "service-table" &&
                                    header === "Service Fee"
                                        ? "pl-0"
                                        : ""
                                }`}
                                    id={`header-${header.toLowerCase()}`}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-sm" id="table-body">
                        {currentData.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="hover:bg-gray-50 transition-colors duration-200"
                                id={`row-${rowIndex}`}
                            >
                                {headers.map((header, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`px-6 py-4 border-b border-gray-200 ${
                                            header === "Actions"
                                                ? "w-2/5"
                                                : "w-1/5"
                                        }`}
                                        id={`cell-${rowIndex}-${colIndex}`}
                                    >
                                        {row[header.toLowerCase()] || "-"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Conditionally render pagination controls */}
                {totalPages > 1 && (
                    <div
                        className="flex flex-col sm:flex-row justify-between items-center mt-4"
                        id="pagination-controls"
                    >
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 border rounded-md text-sm ${
                                currentPage === 1
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-white hover:bg-gray-100 text-gray-700"
                            }`}
                            id="prev-page-btn"
                        >
                            Previous
                        </button>

                        <span
                            className="text-sm text-gray-700 mt-2 sm:mt-0"
                            id="page-info"
                        >
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 border rounded-md text-sm ${
                                currentPage === totalPages
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-white hover:bg-gray-100 text-gray-700"
                            }`}
                            id="next-page-btn"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReusableTable;
