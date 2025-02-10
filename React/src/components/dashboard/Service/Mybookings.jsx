import React, { useState, useEffect, useRef } from "react";
import axiosClient from "../../../axiosClient";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { BsThreeDots } from "react-icons/bs";
import Watermark from "../../../images/Tujitumelogo.svg";
import logo from "../../../images/EmailVertDark.png";
const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Spinner state
    const [openDropdown, setOpenDropdown] = useState(null); // Track which row's dropdown is open
    const dropdownRefs = useRef({}); // Store refs for each row

    useEffect(() => {
        const getBookings = () => {
            setTimeout(() => {
                setLoading(true);
                axiosClient
                    .get("/business/my_booking")
                    .then(({ data }) => {
                        setLoading(false);

                        setBookings(data.results);
                        console.log(data);
                    })
                    .catch((err) => {
                        setLoading(false);

                        console.log(err);
                    });
            }, 500);
        };
        getBookings();
    }, []);

    const [editItem, setEditItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleEdit = (item) => {
        setEditItem(item);
        setShowModal(true);
    };
   
    const handleDelete = (id) => {
        axiosClient
            .get("/bookings/delete/" + id)
            .then(({ data }) => {
                setBookings(bookings.filter((item) => item.id !== id));
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // Toggle Dropdown
    const handleDropdownToggle = (id) => {
        setOpenDropdown((prev) => (prev === id ? null : id));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                openDropdown !== null &&
                dropdownRefs.current[openDropdown] &&
                !dropdownRefs.current[openDropdown].contains(event.target)
            ) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDropdown]);

    const handleSave = () => {
        setBookings(
            bookings.map((item) => (item.id === editItem.id ? editItem : item))
        );
        setShowModal(false);
    };

    const gotoMilestone = (service_id) => {
        const id = btoa(btoa(service_id));
        navigate("/service-milestones/" + id);
    };

    return (
        <div className="bg-white dark:bg-gray-900 shadow-md mt-12 p-6 sm:mt-0 rounded-xl w-full">
            <h1 className="text-[#2D3748] dark:text-gray-200 font-semibold text-2xl mb-4">
                My Bookings
            </h1>

            {loading ? (
                <div className="flex justify-start mb-4">
                    <BarLoader color="#38a169" width={150} />
                </div>
            ) : (
                <>
                    {/* Responsive wrapper for mobile scrolling */}
                    <div className="overflow-x-auto w-full">
                        <table className="min-w-full divide-y divide-gray-600 text-black dark:text-gray-300">
                            <thead className="bg-gray-100 dark:bg-gray-800">
                                <tr className="text-gray-500 dark:text-gray-300">
                                    {[
                                        "Date",
                                        "Service Name",
                                        "Category",
                                        "Notes",
                                        "Start Date",
                                        "Location",
                                        "Status",
                                        "Action",
                                    ].map((header) => (
                                        <th
                                            key={header}
                                            className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                {bookings.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        <td className="px-4 py-4 text-sm">
                                            {item.date}
                                        </td>
                                        <td className="px-4 py-4 text-sm">
                                            {item.service}
                                        </td>
                                        <td className="px-4 py-4 text-sm">
                                            {item.category === "0"
                                                ? "Project Management"
                                                : item.category}
                                        </td>
                                        <td className="px-4 py-4 text-sm">
                                            {item.note}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                                            {
                                                new Date(item.created_at)
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                        </td>
                                        <td className="px-4 py-4 text-sm truncate max-w-xs">
                                            {item.location}
                                        </td>
                                        <td className="px-4 py-4 text-sm">
                                            {item.status}
                                        </td>
                                        <td className="px-4 py-4 text-sm relative">
                                            <div
                                                className="relative inline-block"
                                                ref={(el) =>
                                                    (dropdownRefs.current[
                                                        item.id
                                                    ] = el)
                                                }
                                            >
                                                <button
                                                    onClick={() =>
                                                        handleDropdownToggle(
                                                            item.id
                                                        )
                                                    }
                                                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
                                                >
                                                    <BsThreeDots size={20} />
                                                </button>

                                                {openDropdown === item.id && (
                                                    <div className="absolute top-10 right-0 min-w-[150px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg z-50 p-2 flex flex-col gap-2 transition">
                                                        {item.status ===
                                                        "Confirmed" ? (
                                                            <button
                                                                onClick={() =>
                                                                    gotoMilestone(
                                                                        item.service_id
                                                                    )
                                                                }
                                                                className="w-full py-2 px-4 text-sm font-medium rounded-lg bg-teal-500 hover:bg-teal-600 text-white focus:outline-none transition"
                                                            >
                                                                Pay
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="w-full py-2 px-4 text-sm font-medium rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                disabled
                                                            >
                                                                No Action
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                setSelectedItem(
                                                                    item
                                                                );
                                                                setShowModal2(
                                                                    true
                                                                );
                                                            }}
                                                            className="py-2 px-4 text-sm rounded-lg bg-gray-700 dark:bg-gray-600 text-white cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-gray-900 dark:hover:bg-gray-500"
                                                        >
                                                            View Payment History
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Payment History Modal */}
                    {showModal2 && selectedItem && (
                        <div
                            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
                            onClick={() => setShowModal2(false)}
                        >
                            <div
                                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Print Preview Section */}
                                <div className="p-6 border rounded-lg bg-white dark:bg-gray-900">
                                    {/* Logo and Print Timestamp */}
                                    <div className="flex justify-between items-center mb-4">
                                        <img
                                            src={logo}
                                            alt="Logo"
                                            className="h-12"
                                        />{" "}
                                        {/* Replace with your logo */}
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-4">
                                        Payment History for{" "}
                                        {selectedItem.service || "Unknown"}
                                    </h2>

                                    {/* Transaction Details */}
                                    <div className="mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            <strong>Transaction ID:</strong> #
                                            {selectedItem.id || "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            <strong>Service:</strong>{" "}
                                            {selectedItem.service || "N/A"}
                                        </p>
                                    </div>

                                    {/* Payment Table */}
                                    <div className="overflow-auto max-h-80">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">
                                                    <th className="px-4 py-2 border">
                                                        Date
                                                    </th>
                                                    <th className="px-4 py-2 border">
                                                        Amount ($)
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bookings
                                                    .filter(
                                                        (item) =>
                                                            item.service ===
                                                            selectedItem.service
                                                    )
                                                    .map((item) => (
                                                        <tr
                                                            key={item.id}
                                                            className="border-t hover:bg-gray-50 dark:hover:bg-gray-600"
                                                        >
                                                            <td className="px-4 py-2 border text-center">
                                                                {item.date ||
                                                                    "N/A"}
                                                            </td>
                                                            <td className="px-4 py-2 border text-center font-semibold">
                                                                ${" "}
                                                                {item.amount ||
                                                                    "0"}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                {/* If No Payment History */}
                                                {bookings.filter(
                                                    (item) =>
                                                        item.service ===
                                                        selectedItem.service
                                                ).length === 0 && (
                                                    <tr>
                                                        <td
                                                            colSpan="2"
                                                            className="px-4 py-2 text-center text-gray-500 dark:text-gray-400"
                                                        >
                                                            No payment history
                                                            available
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Total Amount */}
                                    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 border rounded-lg">
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                                            Total Paid: ${" "}
                                            {bookings
                                                .filter(
                                                    (item) =>
                                                        item.service ===
                                                        selectedItem.service
                                                )
                                                .reduce(
                                                    (total, item) =>
                                                        total +
                                                        (item.amount || 0),
                                                    0
                                                )}
                                        </p>
                                    </div>

                                    {/* Security Notice */}
                                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border rounded-lg">
                                        <p className="text-sm">
                                            <strong>⚠️ Security Notice:</strong>{" "}
                                            This receipt is automatically
                                            generated. If you suspect fraud,
                                            contact customer support
                                            immediately.
                                        </p>
                                    </div>
                                </div>

                                {/* Print & Close Buttons */}
                                <div className="mt-4 flex space-x-2">
                                    <button
                                        onClick={() => setShowModal2(false)}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyBookings;
