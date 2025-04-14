import React, { useState, useEffect } from "react";

const ReusableTable = ({ headers, data, rowsPerPage = 5, tableId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Update window width on resize
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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

    // Function to determine if we should hide certain columns on smaller screens
    const shouldHideColumn = (header) => {
        if (windowWidth < 640) {
            return ![
                "name",
                "value needed",
                "my share",
                "status",
                "action",
            ].includes(header.toLowerCase());
        }
        if (windowWidth < 768) {
            return ![
                "name",
                "category",
                "value needed",
                "my share",
                "status",
                "action",
            ].includes(header.toLowerCase());
        }
        return false;
    };

    return (
        <div className="bg-white rounded-lg p-2 sm:p-4 mt-4 mb-4" id={tableId}>
            <div className="overflow-x-auto">
                <table
                    className="min-w-full table-auto border-collapse text-left"
                    id="reusable-table"
                >
                    <thead
                        className="bg-gray-100 text-xs sm:text-sm text-gray-600"
                        id="table-header"
                    >
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className={`px-2 sm:px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b border-gray-300 ${
                                        shouldHideColumn(header)
                                            ? "hidden md:table-cell"
                                            : ""
                                    }`}
                                    id={`header-${header
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-xs sm:text-sm" id="table-body">
                        {currentData.length > 0 ? (
                            currentData.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="hover:bg-gray-50 transition-colors duration-200"
                                    id={`row-${rowIndex}`}
                                >
                                    {headers.map((header, colIndex) => {
                                        const key = header.toLowerCase();
                                        return (
                                            <td
                                                key={colIndex}
                                                className={`px-2 sm:px-4 py-3 sm:py-4 border-b border-gray-200 ${
                                                    shouldHideColumn(header)
                                                        ? "hidden md:table-cell"
                                                        : ""
                                                } ${
                                                    key === "action"
                                                        ? "w-16"
                                                        : ""
                                                }`}
                                                id={`cell-${rowIndex}-${colIndex}`}
                                            >
                                                {row[key] || "-"}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={headers.length}
                                    className="px-4 py-6 text-center text-gray-500 border-b border-gray-200"
                                >
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination controls */}
                {totalPages > 1 && (
                    <div
                        className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2"
                        id="pagination-controls"
                    >
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-xs sm:text-sm ${
                                currentPage === 1
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-white hover:bg-gray-100 text-gray-700"
                            }`}
                            id="prev-page-btn"
                        >
                            Previous
                        </button>

                        <span
                            className="text-xs sm:text-sm text-gray-700 mt-2 sm:mt-0"
                            id="page-info"
                        >
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-xs sm:text-sm ${
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
