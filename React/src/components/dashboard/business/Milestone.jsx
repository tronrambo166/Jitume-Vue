import { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { useAlert } from "../../partials/AlertContext";

function Milestones() {
    const [milestones, setMilestones] = useState([]);
    const [business, setBusiness] = useState([]);
    const [businessName, setBusinessName] = useState([]);
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert

    useEffect(() => {
        const getMilestones = (id) => {
            id = "all";
            axiosClient
                .get("/business/bBQhdsfE_WWe4Q-_f7ieh7Hdhf7E_-" + id)
                .then(({ data }) => {
                    setMilestones(data.milestones);
                    setBusiness(data.business);
                    console.log(data);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getMilestones();
    }, []);

    const getMilestones2 = (id) => {
        axiosClient
            .get("/business/bBQhdsfE_WWe4Q-_f7ieh7Hdhf7E_-" + id)
            .then(({ data }) => {
                setBusinessName(data.business_name);
                setMilestones(data.milestones);
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [selectedBusiness, setSelectedBusiness] = useState("All");

    const handleStatusChange = (e, id) => {
        const updatedMilestones = milestones.map((milestone) =>
            milestone.id === id
                ? { ...milestone, status: e.target.value }
                : milestone
        );
        setMilestones(updatedMilestones);

        // Find the updated milestone's status for display
        const updatedMilestone = updatedMilestones.find(
            (milestone) => milestone.id === id
        );

        // showAlert(
        //     "info",
        //     `Status updated to "${updatedMilestone.status}" for milestone ID ${id}`
        // );
    };

    const handleDelete = (id) => {
        // Confirmation dialog
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this milestone? This action cannot be undone."
        );
        if (!confirmDelete) return;

        axiosClient
            .get(`/business/delete_milestone/${id}`)
            .then(({ data }) => {
                if (data.status === 200) {
                    setMilestones(
                        milestones.filter((milestone) => milestone.id !== id)
                    );
                    showAlert(
                        "success",
                        data.message || "Milestone deleted successfully."
                    );
                } else {
                    showAlert(
                        "warning",
                        data.message ||
                            "Failed to delete milestone. Please try again."
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                showAlert(
                    "error",
                    "An error occurred while deleting the milestone."
                );
            });
    };

    const handleSet = (id, status) => {
        const payload = { id, status };
        axiosClient
            .post("/business/mile_status", payload)
            .then(({ data }) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleDropdownChange = (e) => {
        setSelectedBusiness(e.target.value);
    };

    // Filter milestones based on selected business
    const filteredMilestones =
        selectedBusiness === "All"
            ? milestones
            : milestones.filter(
                  (milestone) => milestone.business === selectedBusiness
              );

    return (
        <div className="container mx-auto p-6">
            <h3 className="text-left text-2xl font-semibold mb-6">
                Business Milestones
            </h3>

            {/* Dropdown for selecting business */}
            <div className="mb-4 flex gap-2">
                <select
                    onChange={(e) => getMilestones2(e.target.value)}
                    className="border rounded-lg p-2 focus:outline-none text-sm focus:ring-2 focus:ring-blue-500"
                >
                    <option value="All">All</option>
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
                                            handleStatusChange(e, milestone.id)
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
                                <td className="py-3 px-4 border-b text-center flex gap-2 items-center justify-center">
                                    <button
                                        onClick={() =>
                                            handleSet(
                                                milestone.id,
                                                milestone.status
                                            )
                                        }
                                        className="text-black px-4 py-2 rounded-lg hover:bg-green transition-colors"
                                    >
                                        Set
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
        </div>
    );
}

export default Milestones;
