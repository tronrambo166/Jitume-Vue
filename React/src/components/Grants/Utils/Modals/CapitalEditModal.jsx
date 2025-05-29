import React, { useState, useEffect } from "react";
import axiosClient from "../../../../axiosClient";

const CapitalEditModal = ({ capitalData, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        offer_title: "",
        total_capital_available: "",
        per_startup_allocation: "",
        startup_stage: "",
        sectors: "",
        regions: "",
        required_docs: "",
        milestone_requirements: "",
        offer_brief_file: null,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    useEffect(() => {
        const fetchCapitalData = async () => {
            if (capitalData) {
                try {
                    setIsDataLoading(true);

                    // If capitalData is just an ID, fetch the full data
                    if (
                        typeof capitalData === "string" ||
                        typeof capitalData === "number"
                    ) {
                        const response = await axiosClient.get(
                            `/capital/get_capital/${capitalData}`
                        );
                        const data =
                            response.data["capital-data"] || response.data;
                        populateFormData(data);
                    } else {
                        // If capitalData is already an object with the full data
                        const data = capitalData["capital-data"] || capitalData;
                        populateFormData(data);
                    }
                } catch (error) {
                    setError("Failed to load capital data");
                    // console.error("Error fetching capital data:", error);
                } finally {
                    setIsDataLoading(false);
                }
            } else {
                setIsDataLoading(false);
            }
        };

        const populateFormData = (data) => {
            setFormData({
                id: data.id || "",
                offer_title: data.offer_title || "",
                total_capital_available: data.total_capital_available || "",
                per_startup_allocation: data.per_startup_allocation || "",
                startup_stage: data.startup_stage || "",
                sectors: data.sectors || "",
                regions: data.regions || "",
                required_docs: data.required_docs || "",
                milestone_requirements: data.milestone_requirements || "",
                offer_brief_file: null, // We don't set the file object from existing data
            });

            if (data.offer_brief_file) {
                setFilePreview(data.offer_brief_file);
            }
        };

        fetchCapitalData();
    }, [capitalData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type === "application/pdf") {
                setFormData((prev) => ({
                    ...prev,
                    offer_brief_file: file,
                }));
                setFilePreview(URL.createObjectURL(file));
                setError(null);
            } else {
                setError("Please upload a PDF file only");
            }
        }
    };

    const removeFile = () => {
        setFormData((prev) => ({
            ...prev,
            offer_brief_file: null,
        }));
        setFilePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formPayload = new FormData();

            // Append all form data except the file if it hasn't changed
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== "") {
                    // For arrays (sectors, regions), join with commas if they're arrays
                    if (Array.isArray(value)) {
                        formPayload.append(key, value.join(","));
                    } else {
                        formPayload.append(key, value);
                    }
                }
            });

            const capitalId =
                typeof capitalData === "object" ? capitalData.id : capitalData;
            const apiUrl = `/capital/update-capital`;

            console.log("Submitting form data:", {
                ...formData,
                offer_brief_file: formData.offer_brief_file
                    ? formData.offer_brief_file.name
                    : "No file selected",
            });

            const response = await axiosClient.post(apiUrl, formPayload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Update successful:", response.data);
            onSave(response.data);
            onClose();
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to update capital offer"
            );
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Show loader while fetching data
    if (isDataLoading) {
        return (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">
                        Loading Please wait...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white z-10 border-b border-gray-100 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Edit Capital Offer
                        </h2>
                        <p className="text-sm text-gray-500">
                            Update the details of this investment opportunity
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-50 transition-colors"
                        aria-label="Close modal"
                    >
                        <svg
                            className="w-6 h-6 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                            <div className="flex items-center">
                                <svg
                                    className="w-5 h-5 text-red-500 mr-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span className="text-red-700 font-medium">
                                    {error}
                                </span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label
                                    htmlFor="offer_title"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Offer Title{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="offer_title"
                                    name="offer_title"
                                    value={formData.offer_title}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    placeholder="Enter offer title"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="total_capital_available"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Total Capital ($){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        id="total_capital_available"
                                        name="total_capital_available"
                                        value={formData.total_capital_available}
                                        onChange={handleChange}
                                        required
                                        className="block w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="per_startup_allocation"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Per Startup Allocation ($){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        id="per_startup_allocation"
                                        name="per_startup_allocation"
                                        value={formData.per_startup_allocation}
                                        onChange={handleChange}
                                        required
                                        className="block w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="startup_stage"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Startup Stage{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="startup_stage"
                                    name="startup_stage"
                                    value={formData.startup_stage}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                >
                                    <option value="">Select stage</option>
                                    <option value="Pre-seed">Pre-seed</option>
                                    <option value="Seed">Seed</option>
                                    <option value="Series A">Series A</option>
                                    <option value="Series B+">Series B+</option>
                                </select>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label
                                    htmlFor="sectors"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Sectors (comma separated){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="sectors"
                                    name="sectors"
                                    value={formData.sectors}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    placeholder="AI/ML, CleanTech, FinTech"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label
                                    htmlFor="regions"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Regions (comma separated){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="regions"
                                    name="regions"
                                    value={formData.regions}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    placeholder="Europe, Asia Pacific, North America"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label
                                    htmlFor="required_docs"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Required Documents (comma separated)
                                </label>
                                <input
                                    type="text"
                                    id="required_docs"
                                    name="required_docs"
                                    value={formData.required_docs}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    placeholder="Financial Projections, Pitch Deck"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label
                                    htmlFor="milestone_requirements"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Milestone Requirements
                                </label>
                                <textarea
                                    id="milestone_requirements"
                                    name="milestone_requirements"
                                    value={formData.milestone_requirements}
                                    onChange={handleChange}
                                    rows={4}
                                    className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    placeholder="Describe the milestones startups need to achieve"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label
                                    htmlFor="offer_brief_file"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Offer Brief PDF
                                </label>
                                <div className="flex items-center gap-4">
                                    <label className="flex flex-col items-center justify-center w-full max-w-xs p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg
                                                className="w-8 h-8 text-gray-400 mb-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                />
                                            </svg>
                                            <p className="text-sm text-gray-500">
                                                <span className="font-semibold">
                                                    Click to upload
                                                </span>{" "}
                                                or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PDF only (max. 2MB)
                                            </p>
                                        </div>
                                        <input
                                            id="offer_brief_file"
                                            name="offer_brief_file"
                                            type="file"
                                            className="hidden"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    {(filePreview ||
                                        formData.offer_brief_file) && (
                                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                            <svg
                                                className="w-6 h-6 text-green-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <div>
                                                <span className="text-sm font-medium">
                                                    {formData.offer_brief_file
                                                        ?.name || "Current PDF"}
                                                </span>
                                                {formData.offer_brief_file && (
                                                    <button
                                                        type="button"
                                                        onClick={removeFile}
                                                        className="ml-2 text-sm text-red-600 hover:text-red-800"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CapitalEditModal;
