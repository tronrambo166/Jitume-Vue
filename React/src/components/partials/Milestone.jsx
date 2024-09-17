import { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Milestones() {
    const [milestones, setMilestones] = useState([]);
    const [business, setBusiness] = useState([]);
    const [businessName, setBusinessName] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    useEffect(() => {
        const getMilestones = (id = "all") => {
            console.log("Fetching milestones with id:", id);
            axiosClient
                .get("/business/bBQhdsfE_WWe4Q-_f7ieh7Hdhf7E_-" + id)
                .then(({ data }) => {
                    console.log("Milestones data received:", data);
                    setMilestones(data.milestones);
                    setBusiness(data.business);
                })
                .catch((err) => {
                    console.error("Error fetching milestones:", err);
                    toast.error("Failed to fetch milestones");
                });
        };
        getMilestones();
    }, []);

    const getMilestones2 = (id) => {
        console.log("Fetching milestones for business id:", id);
        axiosClient
            .get("/business/bBQhdsfE_WWe4Q-_f7ieh7Hdhf7E_-" + id)
            .then(({ data }) => {
                console.log("Milestones data for selected business:", data);
                setBusinessName(data.business_name);
                setMilestones(data.milestones);
            })
            .catch((err) => {
                console.error(
                    "Error fetching milestones for selected business:",
                    err
                );
                toast.error("Failed to fetch milestones for selected business");
            });
    };

    const handleDelete = (id) => {
        console.log("Deleting milestone with id:", id);
        axiosClient
            .get("/business/delete_milestone/" + id)
            .then(({ data }) => {
                console.log("Milestone deleted:", data);
                setMilestones(
                    milestones.filter((milestone) => milestone.id !== id)
                );
                toast.success("Milestone deleted successfully");
            })
            .catch((err) => {
                console.error("Error deleting milestone:", err);
                toast.error("Failed to delete milestone");
            });
    };

    const handleSet = (id, status) => {
        console.log("Setting milestone status for id:", id, "to", status);
        setLoadingId(id); // Set loading state for the current milestone
        const payload = { id: id, status: status };
        axiosClient
            .post("/business/mile_status", payload)
            .then(({ data }) => {
                console.log("Milestone status updated:", data);
                setMilestones((prevMilestones) =>
                    prevMilestones.map((milestone) =>
                        milestone.id === id
                            ? { ...milestone, status: status }
                            : milestone
                    )
                );
                toast.success("Milestone status updated successfully");
            })
            .catch((err) => {
                console.error("Error updating milestone status:", err);
                toast.error("Failed to update milestone status");
            })
            .finally(() => {
                setLoadingId(null); // Reset loading state after request completes
            });
    };

    const filteredMilestones = milestones; // Modify this as needed

    return (
        <div className="container mx-auto p-6">
            <h3 className="text-left text-2xl font-semibold mb-6">
                Business Milestones
            </h3>

            <div className="mb-4 flex gap-2">
                <select
                    onChange={(e) => {
                        console.log("Business selected:", e.target.value);
                        getMilestones2(e.target.value);
                    }}
                    className="border rounded-lg p-2 focus:outline-none text-sm focus:ring-2 focus:ring-blue-500"
                >
                    {business.map((business) => (
                        <option key={business.id} value={business.id}>
                            {business.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100 border-b">
                        <tr className="text-gray-500 text-[12px]">
                            <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                Milestone Name
                            </th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                Business
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
                        {filteredMilestones.map((milestone) => (
                            <tr
                                key={milestone.id}
                                className="text-gray-600 text-sm hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-3 px-4 border-b">
                                    {milestone.title}
                                </td>
                                <td className="py-3 px-4 border-b">
                                    {milestone.business_name}
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
                                        disabled={loadingId === milestone.id} // Disable select while loading
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
                                        className={`text-black px-4 py-2 rounded-lg transition-colors ${
                                            loadingId === milestone.id
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "hover:bg-green"
                                        }`}
                                        disabled={loadingId === milestone.id} // Disable button while loading
                                    >
                                        {loadingId === milestone.id
                                            ? "Loading..."
                                            : "Set"}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(milestone.id)
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
            </div>

            <ToastContainer />
        </div>
    );
}

export default Milestones;
