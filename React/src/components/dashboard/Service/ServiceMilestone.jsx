import { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { ClipLoader } from "react-spinners"; // Spinner from a React library
import { useAlert } from "../../partials/AlertContext";
import { BarLoader } from "react-spinners";
import { FaChevronDown } from "react-icons/fa";
import { ProgressBar } from "react-loader-spinner";

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

   const handleSet = (id, status) => {
       console.log(`Attempting to update milestone ${id} to status: ${status}`);

       setStatusLoading((prev) => ({ ...prev, [id]: true })); // Start loading only for this milestone

       const payload = { id, status };

       axiosClient
           .post("/business/mile_s_status", payload)
           .then(({ data }) => {
               console.log("Response received:", data);

               // Update milestone status
               setMilestones((prevMilestones) =>
                   prevMilestones.map((milestone) =>
                       milestone.id === id
                           ? { ...milestone, status }
                           : milestone
                   )
               );

               console.log(
                   `Milestone ${id} status updated successfully to: ${status}`
               );

               // Show alert based on status
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
               setStatusLoading((prev) => ({ ...prev, [id]: false })); // Stop loading for this milestone
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
                                                        ]
                                                    } // Disable select while loading
                                                >
                                                    <option value="To Do">
                                                        To Do
                                                    </option>
                                                    <option value="In Progress">
                                                        In Progress
                                                    </option>
                                                    <option value="Done">
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
