import React, { useState, useEffect, useRef } from "react";
import axiosClient from "../../../axiosClient";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { BsThreeDots } from "react-icons/bs";

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
        <div className="bg-white shadow-md mt-12 p-12 sm:mt-0 rounded-xl w-full px-0 sm:px-4">
            <h1 className="text-[#2D3748] font-semibold text-2xl mb-4">
                My Bookings
            </h1>
            {loading ? (
                <div className="flex justify-start mb-4">
                    <BarLoader color="#38a169" width={150} />
                </div>
            ) : (
                <>
                    {" "}
                    {/* Responsive wrapper for mobile scrolling */}
                    <div className="overflow-x-auto w-full">
                        <table className="min-w-full divide-y divide-gray-600 text-black">
                            <thead className="bg-gray-100">
                                <tr className="text-gray-500">
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Service Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Notes
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Start Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bookings.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-4 text-sm">
                                            {item.date}
                                        </td>
                                        <td className="px-4 py-4 text-sm">
                                            {item.service}
                                        </td>
                                        <td className="px-4 py-4 text-sm">
                                            {item.category == "0"
                                                ? "Project Management"
                                                : item.category}
                                        </td>
                                        <td className="px-4 py-4 text-sm">
                                            {item.note}
                                        </td>
                                        {/* <td className="px-4 py-4 text-sm">
                                    {item.created_at}
                                </td> */}
                                        {/* <td className="px-6 py-4 text-sm   shadow-sm">
                                    {new Date(item.created_at).toLocaleString(
                                        "en-US",
                                        {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        }
                                    )}
                                </td> */}
                                        <td className="px-6 py-4 text-sm text-gray-700  rounded-lg shadow-sm">
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
                                                {/* Three Dots Button */}
                                                <button
                                                    onClick={() =>
                                                        handleDropdownToggle(
                                                            item.id
                                                        )
                                                    }
                                                    className="p-2 text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
                                                >
                                                    <BsThreeDots size={20} />
                                                </button>

                                                {/* Dropdown Menu */}
                                                {openDropdown === item.id && (
                                                    <div
                                                        className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 
                border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg 
                z-50 p-2 transition"
                                                        style={{
                                                            position: "fixed", // Prevents affecting the table layout
                                                            top: "auto",
                                                            left: "auto",
                                                        }}
                                                    >
                                                        {item.status ===
                                                        "Confirmed" ? (
                                                            <button
                                                                onClick={() =>
                                                                    gotoMilestone(
                                                                        item.service_id
                                                                    )
                                                                }
                                                                className="w-full py-2 px-4 text-sm font-medium rounded-lg 
                        bg-teal-500 hover:bg-teal-600 text-white focus:outline-none transition"
                                                            >
                                                                Pay
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="w-full py-2 px-4 text-sm font-medium rounded-lg 
                        bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                disabled
                                                            >
                                                                No Action
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {showModal && <></>}
                    {showModal2 && (
                        <></>
                        // <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                        //     <div className="bg-white rounded-lg shadow-lg w-1/3 p-4">
                        //         <h2 className="text-xl font-semibold mb-4">
                        //             Edit Booking
                        //         </h2>
                        //         <form
                        //             onSubmit={(e) => {
                        //                 e.preventDefault();
                        //                 handleSave();
                        //             }}
                        //         >
                        //             {/* Form Fields */}
                        //             <div className="mb-4">
                        //                 <label className="block text-sm font-medium mb-2">
                        //                     Date
                        //                 </label>
                        //                 <input
                        //                     type="text"
                        //                     value={editItem.date}
                        //                     onChange={(e) =>
                        //                         setEditItem({
                        //                             ...editItem,
                        //                             date: e.target.value,
                        //                         })
                        //                     }
                        //                     className="border rounded-lg p-2 w-full"
                        //                 />
                        //             </div>
                        //             <div className="mb-4">
                        //                 <label className="block text-sm font-medium mb-2">
                        //                     Service Name
                        //                 </label>
                        //                 <input
                        //                     type="text"
                        //                     value={editItem.serviceName}
                        //                     onChange={(e) =>
                        //                         setEditItem({
                        //                             ...editItem,
                        //                             serviceName: e.target.value,
                        //                         })
                        //                     }
                        //                     className="border rounded-lg p-2 w-full"
                        //                 />
                        //             </div>
                        //             {/* Add more form fields as needed */}
                        //             <div className="flex justify-end">
                        //                 <button
                        //                     type="button"
                        //                     onClick={() => setShowModal(false)}
                        //                     className="text-gray-600 py-2 px-4 mr-2 border rounded-xl hover:underline"
                        //                 >
                        //                     Cancel
                        //                 </button>
                        //                 <button
                        //                     type="submit"
                        //                     className="text-blue-600 py-2 px-4 border rounded-xl hover:underline"
                        //                 >
                        //                     Save
                        //                 </button>
                        //             </div>
                        //         </form>
                        //     </div>
                        // </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyBookings;
