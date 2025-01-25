import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import {
    useNavigate,
    useParams
} from "react-router-dom";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getBookings = () => {
            setTimeout(() => {
                axiosClient
                    .get("/business/my_booking")
                    .then(({ data }) => {
                        setBookings(data.results);
                        console.log(data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }, 500);
        };
        getBookings();
    }, []);

    const [editItem, setEditItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

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

    const handleSave = () => {
        setBookings(
            bookings.map((item) => (item.id === editItem.id ? editItem : item))
        );
        setShowModal(false);
    };

    const gotoMilestone = (service_id) => {
        const id = btoa(btoa(service_id));
        navigate("/service-milestones/"+id);
    };


    return (
        <div className="bg-white shadow-md mt-12 p-12 sm:mt-0 rounded-xl w-full px-0 sm:px-4">
            <h1 className="text-[#2D3748] font-semibold text-2xl mb-4">
                My Bookings
            </h1>
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
                                    {item.category == '0'?'Project Management':item.category}
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
                                <td className="px-4 py-4 text-sm">
                                    {item.status=='Confirmed'?(
                                        <button
                                        onClick={() => gotoMilestone(item.service_id)}
                                        className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-teal-400 text-teal-800 hover:bg-teal-200 focus:outline-none focus:bg-teal-200 disabled:opacity-50 disabled:pointer-events-none dark:text-teal-500 dark:bg-teal-800/30 dark:hover:bg-teal-800/20 dark:focus:bg-teal-800/20"
                                    
                                        > Pay
                                        </button>
                                    ):(
                                    <button
                                        
                                        className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-teal-400 text-teal-800 hover:bg-teal-200 focus:outline-none focus:bg-teal-200 disabled:opacity-50 disabled:pointer-events-none dark:text-teal-500 dark:bg-teal-800/30 dark:hover:bg-teal-800/20 dark:focus:bg-teal-800/20"
                                    
                                        > -
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg w-1/3 p-4">
                        <h2 className="text-xl font-semibold mb-4">
                            Edit Booking
                        </h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSave();
                            }}
                        >
                            {/* Form Fields */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Date
                                </label>
                                <input
                                    type="text"
                                    value={editItem.date}
                                    onChange={(e) =>
                                        setEditItem({
                                            ...editItem,
                                            date: e.target.value,
                                        })
                                    }
                                    className="border rounded-lg p-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Service Name
                                </label>
                                <input
                                    type="text"
                                    value={editItem.serviceName}
                                    onChange={(e) =>
                                        setEditItem({
                                            ...editItem,
                                            serviceName: e.target.value,
                                        })
                                    }
                                    className="border rounded-lg p-2 w-full"
                                />
                            </div>
                            {/* Add more form fields as needed */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-600 py-2 px-4 mr-2 border rounded-xl hover:underline"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="text-blue-600 py-2 px-4 border rounded-xl hover:underline"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
