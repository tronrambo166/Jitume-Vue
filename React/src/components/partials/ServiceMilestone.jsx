import { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners"; // Spinner from a React library

function ServiceMilestone() {
    const [milestones, setMilestones] = useState([]);
    const [business, setBusiness] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("All");
    const [S_id, setS_id] = useState("");
    const [S_name, setS_name] = useState("");
    const [bookerName, setbookerName] = useState("");
    const [loading, setLoading] = useState(false); // Spinner state
    const toastId = "milestone-toast"; // Unique toastId to prevent multiple toasts

    useEffect(() => {
        const getMilestones = (id = "all") => {
            setLoading(true); // Show spinner
            axiosClient
                .get(`/business/bBQhdsfE_WWe4Q-_f7ieh7Hdhf4F_-${id}`)
                .then(({ data }) => {
                    setBusiness(data.business);
                    setMilestones([]); // Reset milestones when changing the service
                    setCustomers([]); // Reset customers when switching services
                    setSelectedCustomer("All"); // Reset customer dropdown
                    if (!toast.isActive(toastId)) {
                        toast.success("Data fetched successfully!", {
                            toastId,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    if (!toast.isActive(toastId)) {
                        toast.error("Error fetching data. Please try again.", {
                            toastId,
                        });
                    }
                })
                .finally(() => {
                    setLoading(false); // Hide spinner
                });
        };
        getMilestones();
    }, []);

    const handleSet = (id, status) => {
        setLoading(true); // Show spinner
        const payload = {
            id: id,
            status: status,
        };

        axiosClient
            .post("/business/mile_s_status", payload)
            .then(({ data }) => {
                if (!toast.isActive(toastId)) {
                    // Prevent duplicate toasts
                    toast.success(data.message, { toastId });
                }
            })
            .catch((err) => {
                console.log(err);
                const response = err.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
                if (!toast.isActive(toastId)) {
                    // Prevent duplicate toasts
                    toast.error("An error occurred. Please try again.", {
                        toastId,
                    });
                }
            })
            .finally(() => {
                setLoading(false); // Hide spinner
            });
    };

    const getBookers = (e) => {
        const id = e.target.value;
        setS_id(id);
        setLoading(true); // Show spinner

        axiosClient
            .get(`/business/getBookers/${id}`)
            .then(({ data }) => {
                setCustomers(data.data || []);
                setMilestones([]); // Reset milestones when changing the service
                setSelectedCustomer("All"); // Reset customer dropdown when switching services
                setS_name(""); // Reset service name
                setbookerName(""); // Reset booker name
                if (!toast.isActive(toastId)) {
                    toast.success("Customers fetched successfully!", {
                        toastId,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                if (!toast.isActive(toastId)) {
                    toast.error("Error fetching customers.", { toastId });
                }
            })
            .finally(() => {
                setLoading(false); // Hide spinner
            });
    };

    const handleCustomerChange = (e) => {
        const customer = e.target.value;
        setSelectedCustomer(customer);
        setMilestones([]); // Reset milestones when customer changes

        if (S_id) {
            setLoading(true); // Show spinner
            axiosClient
                .get(`/business/findMilestones/${S_id}/${customer}`)
                .then(({ data }) => {
                    setMilestones(data.milestones || []);
                    setS_name(data.s_name); // Update service name
                    setbookerName(data.booker_name); // Update booker name
                    if (!toast.isActive(toastId)) {
                        toast.success("Milestones fetched successfully!", {
                            toastId,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    if (!toast.isActive(toastId)) {
                        toast.error("Error fetching milestones.", { toastId });
                    }
                })
                .finally(() => {
                    setLoading(false); // Hide spinner
                });
        }
    };

    return (
        <div className="container mx-auto p-6">
            <ToastContainer /> {/* Toastify container */}
            <h3 className="text-left text-2xl font-semibold mb-6">
                Service Milestones
            </h3>
            {/* Dropdowns for selecting service and customer */}
            <div className="mb-4 flex gap-2">
                <select
                    value={S_id}
                    onChange={getBookers}
                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="" disabled>
                        Select Service
                    </option>{" "}
                    {/* Add a default option */}
                    {business.map((business) => (
                        <option key={business.id} value={business.id}>
                            {business.name}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedCustomer}
                    onChange={handleCustomerChange}
                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={customers.length === 0} // Disable if no customers to select
                >
                    <option value="All">Select Customer</option>
                    {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                            {customer.name}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    className="btn-primary py-2 text-white rounded-md px-6"
                >
                    Find
                </button>
            </div>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100 border-b">
                        <tr className="text-gray-500">
                            <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                Milestone Name
                            </th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                Service
                            </th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                Customer
                            </th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                Amount
                            </th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                Status
                            </th>
                            <th className="text-center py-3 px-4 uppercase font-semibold text-sm">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {milestones.map((milestone) => (
                            <tr
                                key={milestone.id}
                                className="text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-3 px-4 border-b">
                                    {milestone.title}
                                </td>
                                <td className="py-3 px-4 border-b">{S_name}</td>
                                <td className="py-3 px-4 border-b">
                                    {bookerName}
                                </td>
                                <td className="py-3 px-4 border-b">
                                    ${milestone.amount}
                                </td>
                                <td className="py-3 px-4 border-b">
                                    <select
                                        value={milestone.status}
                                        onChange={(e) =>
                                            handleSet(
                                                milestone.id,
                                                e.target.value
                                            )
                                        }
                                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="To Do">To Do</option>
                                        <option value="In Progress">
                                            In Progress
                                        </option>
                                        <option value="Done">Done</option>
                                    </select>
                                </td>
                                <td className="py-3 px-4 border-b text-center flex gap-2 items-center">
                                    <button
                                        onClick={() =>
                                            handleSet(
                                                milestone.id,
                                                milestone.status
                                            )
                                        }
                                        className="border border-black text-black px-4 py-2 rounded-lg hover:bg-green-500 transition-colors"
                                    >
                                        Set
                                    </button>
                                    <button
                                        onClick={() =>
                                            setMilestones(
                                                milestones.filter(
                                                    (m) => m.id !== milestone.id
                                                )
                                            )
                                        }
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {loading && (
                    <div className="flex justify-center items-center mt-6">
                        <ClipLoader
                            size={35}
                            color={"#123abc"}
                            loading={loading}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ServiceMilestone;
