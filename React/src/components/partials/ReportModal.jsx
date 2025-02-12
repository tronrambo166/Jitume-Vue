import React, { useState } from "react";

const ReportModal = ({ onClose, logo }) => {
    const [reportReason, setReportReason] = useState("");
    const [customReason, setCustomReason] = useState("");

    const handleSubmit = () => {
        const finalReason =
            reportReason === "Other" ? customReason : reportReason;
        if (!finalReason) return alert("Please select a reason.");

        console.log("Report Submitted:", finalReason);
        onClose(); // Close modal after submission
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-[500px] relative top-[-40px]">
                {/* Logo Section */}
                {logo && (
                    <img
                        src={logo}
                        alt="Business Logo"
                        className="h-14 w-14 mx-auto mb-3"
                    />
                )}

                <h2 className="text-xl font-semibold text-center mb-4">
                    Report This Business
                </h2>
                <p className="text-sm text-gray-600 text-center mb-4">
                    Please select a reason for reporting this business. Your
                    report will help us keep the platform safe.
                </p>

                {/* Report Reasons with Explanations */}
                <div className="space-y-3">
                    {[
                        {
                            label: "Scam/Fraud",
                            desc: "This business is involved in fraudulent activities.",
                        },
                        {
                            label: "Incorrect Information",
                            desc: "The details listed for this business are incorrect.",
                        },
                        {
                            label: "Fake Business",
                            desc: "This business does not exist or is misleading users.",
                        },
                        {
                            label: "Other",
                            desc: "Specify your own reason below.",
                        },
                    ].map(({ label, desc }) => (
                        <label key={label} className="block">
                            <div className="flex items-start space-x-3 p-2 border rounded-md hover:bg-gray-100">
                                <input
                                    type="radio"
                                    value={label}
                                    checked={reportReason === label}
                                    onChange={(e) =>
                                        setReportReason(e.target.value)
                                    }
                                    className="mt-1 form-radio text-red-500"
                                />
                                <div>
                                    <span className="font-medium">{label}</span>
                                    <p className="text-sm text-gray-500">
                                        {desc}
                                    </p>
                                </div>
                            </div>
                        </label>
                    ))}
                </div>

                {/* Custom Input for "Other" Option */}
                {reportReason === "Other" && (
                    <textarea
                        placeholder="Describe the issue..."
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        className="w-full mt-3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        rows="3"
                    />
                )}

                {/* Modal Buttons */}
                <div className="mt-5 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                        Submit Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
