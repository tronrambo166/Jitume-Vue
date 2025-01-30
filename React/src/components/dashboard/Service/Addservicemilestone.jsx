import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { useAlert } from "../../partials/AlertContext";
import { BarLoader } from "react-spinners";

function Addservicemilestone() {
    const [form, setForm] = useState({
        title: "",
        amount: "",
        time_type: "Days",
        n_o_days: "01",
        file: null,
        business_id: "",
    });

    const [fileAlert, setFileAlert] = useState("");
    const [milestones, setMilestones] = useState([]);
    const [business, setBusiness] = useState([]);
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert
    const [loading, setLoading] = useState(false); // Spinner state

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setForm({ ...form, file: selectedFile });
            setFileAlert("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.file) {
            setFileAlert("No files selected!");
            showAlert(
                "error",
                "You cannot select the same file for different milestones!"
            ); // Show error alert
            return;
        }

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("amount", form.amount);
        formData.append("time_type", form.time_type);
        formData.append("n_o_days", form.n_o_days);
        formData.append("business_id", form.business_id);
        formData.append("file", form.file);

        try {
            showAlert("info", "Uploading..."); // Show info alert before uploading
            const response = await axiosClient.post(
                "business/save_s_milestone",
                formData
            );

            if (response.data.status === 200) {
                showAlert("success", response.data.message); // Success alert on successful upload
                getMilestones();

                // Clear the form
                setForm({
                    title: "",
                    amount: "",
                    time_type: "Days",
                    n_o_days: "01",
                    file: null,
                    business_id: "",
                });
            } else {
                showAlert(
                    "error",
                    response.data.message || "Something went wrong."
                );
            }
        } catch (error) {
            showAlert("error", error.message || "An error occurred"); // Error alert for failed request
            console.log(error);
        }
    };

    const getMilestones = () => {
        setLoading(true);
        axiosClient
            .get("/business/add_s_milestones")
            .then(({ data }) => {
        setLoading(false);

                setMilestones(data.milestones);
                setBusiness(data.business);
            })
            .catch((err) => {
        setLoading(false);

                console.log(err);
            });
    };

    useEffect(() => {
        getMilestones();
    }, []);

    const handleStatusChange = (e, id) => {
        const updatedMilestones = milestones.map((milestone) =>
            milestone.id === id
                ? { ...milestone, status: e.target.value }
                : milestone
        );
        setMilestones(updatedMilestones);
    };

    return (
        <div className="bg-white shadow-md mt-12 p-12 sm:mt-0 rounded-xl w-full px-0 sm:px-4">
            <h3 className="text-left text-lg font-semibold mb-6">
                Add Service Milestone
            </h3>
            {loading ? (
                <div className="flex justify-start mb-4">
                    <BarLoader color="#38a169" width={150} />
                </div>
            ) : (
                <>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-wrap md:flex-nowrap text-sm gap-4 items-center mb-8"
                    >
                        <input
                            name="title"
                            type="text"
                            placeholder="Milestone Name"
                            className="w-full md:w-1/5 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={form.title}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            name="amount"
                            type="number"
                            placeholder="Amount"
                            className="w-full md:w-1/5 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={form.amount}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="flex gap-2 w-full md:w-1/4">
                            <select
                                name="time_type"
                                className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={form.time_type}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="Days">Days</option>
                                <option value="Weeks">Weeks</option>
                                <option value="Months">Months</option>
                            </select>
                            <select
                                name="n_o_days"
                                className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={form.n_o_days}
                                onChange={handleInputChange}
                                required
                            >
                                {[...Array(30).keys()].map((num) => (
                                    <option
                                        key={num}
                                        value={String(num + 1).padStart(2, "0")}
                                    >
                                        {String(num + 1).padStart(2, "0")}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <label className="w-full md:w-1/5 border bg-green text-white rounded-lg p-2 text-center cursor-pointer hover:bg-gray-800 transition-colors whitespace-nowrap">
                            Upload Documentation
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                required
                            />
                        </label>

                        <select
                            name="business_id"
                            className="w-full md:w-1/5 border rounded-lg p-2 focus:outline-none"
                            value={form.business_id}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="" hidden>
                                Select Service
                            </option>
                            {business.map((business) => (
                                <option key={business.id} value={business.id}>
                                    {business.name}
                                </option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className="w-full md:w-1/5 bg-green text-white py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
                            disabled={
                                !form.business_id || !form.title || !form.amount
                            }
                        >
                            Add Milestone
                        </button>
                    </form>

                    <div className="mt-8">
                        <h5 className="text-xl text-gray-700 font-semibold mb-4">
                            Recently Added Milestones
                        </h5>
                        <div className="overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-100 border-b">
                                    <tr className="text-gray-400">
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
                                        <th className="text-center py-3 px-4 uppercase font-semibold text-[12px]">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {milestones.map((milestone) => (
                                        <tr
                                            key={milestone.id}
                                            className="text-gray-500 hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="py-3 px-4 border-b">
                                                {milestone.title}
                                            </td>
                                            <td className="py-3 px-4 border-b">
                                                {milestone.business_name}
                                            </td>
                                            <td className="py-3 px-4 border-b">
                                                $
                                                {milestone.amount.toLocaleString()}
                                            </td>
                                            <td className="py-3 px-4 border-b">
                                                <select
                                                    value={milestone.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            e,
                                                            milestone.id
                                                        )
                                                    }
                                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                >
                                                    <option value="In Progress">
                                                        {milestone.status}
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Addservicemilestone;
