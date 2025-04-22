import React, { useState, useEffect } from "react";
import axiosClient from "../../../../axiosClient";

const GrantEditModal = ({ grantData, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        grant_title: "",
        total_grant_amount: "",
        application_deadline: "",
        eligibility_criteria: "",
        evaluation_criteria: "",
        funding_per_business: "",
        grant_focus: "",
        impact_objectives: "",
        startup_stage_focus: "",
        required_documents: "",
        grant_brief_pdf: null,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    useEffect(() => {
        if (grantData) {
            setFormData({
                grant_title: grantData.grant_title || "",
                total_grant_amount: grantData.total_grant_amount || "",
                application_deadline: grantData.application_deadline || "",
                eligibility_criteria: grantData.eligibility_criteria || "",
                evaluation_criteria: grantData.evaluation_criteria || "",
                funding_per_business: grantData.funding_per_business || "",
                grant_focus: grantData.grant_focus || "",
                impact_objectives: grantData.impact_objectives || "",
                startup_stage_focus: grantData.startup_stage_focus || "",
                required_documents: grantData.required_documents || "",
                grant_brief_pdf: grantData.grant_brief_pdf || null,
            });

            if (grantData.grant_brief_pdf) {
                setFilePreview(grantData.grant_brief_pdf);
            }
        }
    }, [grantData]);


    console.log("Grant Data:", grantData);
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
                    grant_brief_pdf: file,
                }));
                setFilePreview(URL.createObjectURL(file));
            } else {
                setError("Please upload a PDF file only");
            }
        }
    };

 const handleSubmit = async (e) => {
     e.preventDefault();
     setIsLoading(true);
     setError(null);

     try {
         const formPayload = new FormData();

         // First log the original formData
         console.log("Original formData:", formData);

         // Build FormData and log each entry
         console.log("FormData entries:");
         for (const key in formData) {
             if (formData[key] !== null) {
                 // Special handling for File objects
                 if (formData[key] instanceof File) {
                     console.log(`${key}:`, {
                         name: formData[key].name,
                         size: `${(formData[key].size / 1024).toFixed(2)} KB`,
                         type: formData[key].type,
                     });
                 } else {
                     console.log(`${key}:`, formData[key]);
                 }
                 formPayload.append(key, formData[key]);
             }
         }

         // Alternative way to log FormData content
         const formDataObj = {};
         for (let [key, value] of formPayload.entries()) {
             if (value instanceof File) {
                 formDataObj[key] = {
                     name: value.name,
                     size: `${(value.size / 1024).toFixed(2)} KB`,
                     type: value.type,
                 };
             } else {
                 formDataObj[key] = value;
             }
         }
         console.log("FormData content:", formDataObj);

         const apiUrl = "change here when the send you the api in the group/grants/" + grantData.id;
         console.log("Submitting to:", apiUrl);

         const response = await axiosClient.put(apiUrl, formPayload, {
             headers: {
                 "Content-Type": "multipart/form-data",
                 // 'Authorization': 'Bearer your_token_here'
             },
         });

         console.log("API response:", response.data);
         onSave(response.data);
         onClose();
     } catch (err) {
         console.error("Error details:", {
             message: err.message,
             response: err.response,
             request: err.request,
             config: err.config,
         });
         setError(err.response?.data?.message || "Failed to update grant");
     } finally {
         setIsLoading(false);
     }
 };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white z-10 border-b border-gray-100 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Edit Grant Program
                        </h2>
                        <p className="text-sm text-gray-500">
                            Update the details of this funding opportunity
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

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label
                                    htmlFor="grant_title"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Grant Title{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="grant_title"
                                    name="grant_title"
                                    value={formData.grant_title}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Enter grant title"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="grant_focus"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Grant Focus{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="grant_focus"
                                    name="grant_focus"
                                    value={formData.grant_focus}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="E.g., Technology, Healthcare, Education"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="total_grant_amount"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Total Grant Amount ($){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        id="total_grant_amount"
                                        name="total_grant_amount"
                                        value={formData.total_grant_amount}
                                        onChange={handleChange}
                                        required
                                        className="block w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="funding_per_business"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Funding per Business ($){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        id="funding_per_business"
                                        name="funding_per_business"
                                        value={formData.funding_per_business}
                                        onChange={handleChange}
                                        required
                                        className="block w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="application_deadline"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Application Deadline{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="application_deadline"
                                    name="application_deadline"
                                    value={formData.application_deadline}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="startup_stage_focus"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Startup Stage Focus
                                </label>
                                <select
                                    id="startup_stage_focus"
                                    name="startup_stage_focus"
                                    value={formData.startup_stage_focus}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                >
                                    <option value="">Select stage</option>
                                    <option value="Seed">Seed</option>
                                    <option value="Early">Early</option>
                                    <option value="Growth">Growth</option>
                                    <option value="Mature">Mature</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="eligibility_criteria"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Eligibility Criteria
                            </label>
                            <textarea
                                id="eligibility_criteria"
                                name="eligibility_criteria"
                                value={formData.eligibility_criteria}
                                onChange={handleChange}
                                rows={4}
                                className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Describe who is eligible to apply for this grant"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label
                                    htmlFor="evaluation_criteria"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Evaluation Criteria
                                </label>
                                <textarea
                                    id="evaluation_criteria"
                                    name="evaluation_criteria"
                                    value={formData.evaluation_criteria}
                                    onChange={handleChange}
                                    rows={4}
                                    className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="How applications will be evaluated"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="impact_objectives"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Impact Objectives
                                </label>
                                <textarea
                                    id="impact_objectives"
                                    name="impact_objectives"
                                    value={formData.impact_objectives}
                                    onChange={handleChange}
                                    rows={4}
                                    className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Expected outcomes and impacts of the grant"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="required_documents"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Required Documents
                            </label>
                            <input
                                type="text"
                                id="required_documents"
                                name="required_documents"
                                value={formData.required_documents}
                                onChange={handleChange}
                                className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="List documents needed (comma separated)"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="grant_brief_pdf"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Grant Brief PDF
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
                                        id="grant_brief_pdf"
                                        name="grant_brief_pdf"
                                        type="file"
                                        className="hidden"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                {filePreview && (
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                        <svg
                                            className="w-6 h-6 text-red-500"
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
                                        <span className="text-sm font-medium">
                                            {formData.grant_brief_pdf?.name ||
                                                "Current PDF"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 flex items-center justify-center min-w-[120px]"
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

export default GrantEditModal;
