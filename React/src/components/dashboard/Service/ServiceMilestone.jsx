import { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { ClipLoader } from "react-spinners"; // Spinner from a React library
import { useAlert } from "../../partials/AlertContext";
import { BarLoader } from "react-spinners";
import { FaChevronDown } from "react-icons/fa";
import { ProgressBar } from "react-loader-spinner";
import TujitumeLogo from "../../../images/Tujitumelogo.svg";

function ServiceMilestone() {
    const [milestones, setMilestones] = useState([]);
    const [business, setBusiness] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("All");
    const [S_id, setS_id] = useState("");
    const [S_name, setS_name] = useState("");
    const [bookerName, setbookerName] = useState("");
    const [loading, setLoading] = useState(false); // Spinner state
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert
    const [getloading, setGetLoading] = useState(false); // Spinner state
    const [statusLoading, setStatusLoading] = useState({});

    useEffect(() => {
        const getMilestones = (id = "all") => {
            setGetLoading(true);
            setLoading(true); // Show spinner
            axiosClient
                .get(`/business/bBQhdsfE_WWe4Q-_f7ieh7Hdhf4F_-${id}`)
                .then(({ data }) => {
                    setGetLoading(false);

                    setBusiness(data.business);
                    setMilestones([]); // Reset milestones when changing the service
                    setCustomers([]); // Reset customers when switching services
                    setSelectedCustomer("All"); // Reset customer dropdown
                })
                .catch((err) => {
                    setGetLoading(false);

                    console.log("Error loading data", err);
                    showAlert("error", "Failed to load business data"); // Use showAlert for error message
                })
                .finally(() => {
                    setGetLoading(false);

                    setLoading(false); // Hide spinner
                });
        };

        // Call getMilestones
        getMilestones();
    }, []);

    //    const handleSet = (id, status) => {
    //        console.log(`Attempting to update milestone ${id} to status: ${status}`);

    //        setStatusLoading((prev) => ({ ...prev, [id]: true })); // Start loading only for this milestone

    //        const payload = { id, status };

    //        axiosClient
    //            .post("/business/mile_s_status", payload)
    //            .then(({ data }) => {
    //                console.log("Response received:", data);

    //                // Update milestone status
    //                setMilestones((prevMilestones) =>
    //                    prevMilestones.map((milestone) =>
    //                        milestone.id === id
    //                            ? { ...milestone, status }
    //                            : milestone
    //                    )
    //                );

    //                console.log(
    //                    `Milestone ${id} status updated successfully to: ${status}`
    //                );

    //                // Show alert based on status
    //                if (status === "Done") {
    //                    showAlert("info", "Status updated, Email sent");
    //                } else {
    //                    showAlert("success", "Status updated successfully");
    //                }
    //            })
    //            .catch((err) => {
    //                console.error("Error updating status:", err);
    //                showAlert("error", "Failed to update status");
    //            })
    //            .finally(() => {
    //                setStatusLoading((prev) => ({ ...prev, [id]: false })); // Stop loading for this milestone
    //                console.log("Request completed for milestone", id);
    //            });
    //    };

    const handleSet = (id, status) => {
        const milestone = milestones.find((m) => m.id === id);
        if (!milestone) return;

        if (milestone.status === "To Do" && status === "Done") {
            showAlert("error", "You can't jump to 'Done' directly.");
            return;
        }

        if (milestone.status === "In Progress" && status === "To Do") {
            showAlert("error", "You can't move back to 'To Do'.");
            return;
        }

        if (milestone.status === "Done") {
            showAlert("error", "This milestone is already completed.");
            return;
        }

        // Automatically set 'In Progress' when moving from 'To Do'
        if (milestone.status === "To Do" && status === "In Progress") {
            updateStatus(id, "In Progress");
            return;
        }

        if (status === "Done") {
            $.confirm({
                title: false,
                content: `
            <div class="text-start">
                <div class="flex items-center">
                    <img src="${TujitumeLogo}" alt="Tujitume Logo" style="max-width: 100px; margin-right: 10px;" class="jconfirm-logo">
                </div>
                <h2 class="text-lg mt-2 font-semibold text-gray-800">Mark this milestone as Done?</h2>
                <p class="text-gray-600 mt-2">
                    You are about to complete the milestone 
                    <span class="text-green-600 font-semibold">
                        "${milestone.title}"
                    </span>.
                </p>
                <p class="text-gray-500 text-sm mt-1">This action cannot be undone.</p>
            </div>
        `,
                buttons: {
                    Confirm: {
                        text: "Yes, Mark it Done",
                        btnClass: "custom-green-btn",
                        action: function () {
                            updateStatus(id, "Done");
                        },
                    },
                    Cancel: {
                        text: "No, Cancel",
                        btnClass: "custom-gray-btn",
                        action: function () {
                            showAlert("info", "Milestone update canceled.");
                        },
                    },
                },
            });
        } else {
            updateStatus(id, status);
        }
    };

    const updateStatus = (id, status) => {
        console.log(
            `Attempting to update milestone ${id} to status: ${status}`
        );

        setStatusLoading((prev) => ({ ...prev, [id]: true }));

        const payload = { id, status };

        axiosClient
            .post("/business/mile_s_status", payload)
            .then(({ data }) => {
                console.log("Response received:", data);

                setMilestones((prevMilestones) =>
                    prevMilestones.map((milestone) =>
                        milestone.id === id
                            ? { ...milestone, status }
                            : milestone
                    )
                );

                console.log(`Milestone ${id} status updated to: ${status}`);

                if (status === "Done") {
                    showAlert("info", "Status updated, Email sent");
                } else {
                    showAlert("success", "Status updated successfully");
                }
            })
            .catch((err) => {
                console.error("Error updating status:", err);
                showAlert("error", "Failed to update status");
            })
            .finally(() => {
                setStatusLoading((prev) => ({ ...prev, [id]: false }));
                console.log("Request completed for milestone", id);
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
            })
            .catch((err) => {
                console.log("Error loading customers", err);
                showAlert("error", "Failed to load bookers"); // Use showAlert for error message
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
                })
                .catch((err) => {
                    console.log("Error fetching milestones", err);
                    showAlert("error", "Failed to load milestones"); // Use showAlert for error
                })
                .finally(() => {
                    setLoading(false); // Hide spinner
                });
        }
    };

    return (
        <div className="bg-white shadow-md mt-12 p-12 sm:mt-0 rounded-xl w-full px-0 sm:px-4">
            <h3 className="text-left text-2xl font-semibold mb-6">
                Service Milestones
            </h3>
            {getloading ? (
                <div className="flex justify-start mb-4">
                    <BarLoader color="#38a169" width={150} />
                </div>
            ) : (
                <>
                    {" "}
                    {/* Dropdowns for selecting service and customer */}
                    <div className="mb-4 flex gap-2">
                        <div className="relative w-full">
                            <select
                                value={S_id}
                                onChange={getBookers}
                                className="border rounded-lg p-2 pr-8 w-full focus:outline-none focus:ring-2 focus:ring-green appearance-none"
                            >
                                <option value="" disabled>
                                    Select Service
                                </option>
                                {business.map((business) => (
                                    <option
                                        key={business.id}
                                        value={business.id}
                                    >
                                        {business.name}
                                    </option>
                                ))}
                            </select>
                            <FaChevronDown className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>

                        <div className="relative w-full">
                            <select
                                value={selectedCustomer}
                                onChange={handleCustomerChange}
                                className={`border rounded-lg p-2 pr-8 w-full focus:outline-none 
        focus:ring-2 appearance-none 
        ${
            customers.length === 0
                ? "bg-gray-200 border-red-500"
                : "focus:ring-green border-green-500"
        }`}
                                disabled={customers.length === 0} // Disable if no customers
                            >
                                <option value="All">Select Customer</option>
                                {customers.map((customer) => (
                                    <option
                                        key={customer.id}
                                        value={customer.id}
                                    >
                                        {customer.name}
                                    </option>
                                ))}
                            </select>

                            <FaChevronDown className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>

                        {/* Find button with a spinner inside */}
                    </div>
                    <div className="overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100 border-b">
                                <tr className="text-gray-500">
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-[12px] w-2/5">
                                        Milestone Name
                                    </th>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-[12px] w-1/5">
                                        Service
                                    </th>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-[12px] w-1/5">
                                        Customer
                                    </th>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-[12px] w-1/6">
                                        Amount
                                    </th>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-[12px] w-1/6">
                                        Status
                                    </th>
                                    {/* <th className="text-center py-3 px-4 uppercase font-semibold text-[12px] w-1/6">
                                        Action
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {milestones.map((milestone) => (
                                    <tr
                                        key={milestone.id}
                                        className="text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="py-3 px-4 border-b w-2/5">
                                            {milestone.title}
                                        </td>
                                        <td className="py-3 px-4 border-b w-1/5">
                                            {S_name}
                                        </td>
                                        <td className="py-3 px-4 border-b w-1/5">
                                            {bookerName}
                                        </td>
                                        <td className="py-3 px-4 border-b w-1/6">
                                            ${milestone.amount.toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 border-b w-1/6">
                                            <div className="relative flex items-center">
                                                <select
                                                    value={milestone.status}
                                                    onChange={(e) =>
                                                        handleSet(
                                                            milestone.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green pr-10"
                                                    disabled={
                                                        statusLoading[
                                                            milestone.id
                                                        ] ||
                                                        milestone.status ===
                                                            "Done"
                                                    }
                                                >
                                                    <option
                                                        value="To Do"
                                                        disabled={
                                                            milestone.status !==
                                                            "To Do"
                                                        }
                                                    >
                                                        To Do
                                                    </option>
                                                    <option
                                                        value="In Progress"
                                                        disabled
                                                    >
                                                        In Progress
                                                    </option>
                                                    <option
                                                        value="Done"
                                                        disabled={
                                                            milestone.status !==
                                                            "In Progress"
                                                        }
                                                    >
                                                        Done
                                                    </option>
                                                </select>

                                                {/* Floating Loader on the Right */}
                                                {statusLoading[
                                                    milestone.id
                                                ] && (
                                                    <div className="absolute right-2">
                                                        <ClipLoader
                                                            size={20}
                                                            color="green"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 border-b text-center w-1/6">
                                            {/* <button
                                                onClick={() =>
                                                    handleSet(
                                                        milestone.id,
                                                        milestone.status
                                                    )
                                                }
                                                className="border border-black text-black px-4 py-2 rounded-lg"
                                            >
                                                Update
                                            </button> */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default ServiceMilestone;
