import React, { useState, useRef, useEffect } from "react";
import logo from "../../images/EmailVertDark.png"; // Import logo
import { useAlert } from "../partials/AlertContext";

const ReportModalSev = ({ onClose }) => {
    const [reportReason, setReportReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const inputRef = useRef(null); // Ref for scrolling to input
const { showAlert } = useAlert(); // Destructuring showAlert from useAlert

    // Scroll to input field when "Other" is selected
    useEffect(() => {
        if (reportReason === "Other" && inputRef.current) {
            inputRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            inputRef.current.focus();
        }
    }, [reportReason]);

    const handleSubmit = () => {
        const finalReason =
            reportReason === "Other" ? customReason : reportReason;
        if (!finalReason.trim()) {
            return showAlert("info", "Please select a reason.");
        }

        console.log("Service Report Submitted:", finalReason);
        onClose(); // Close modal after submission
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg relative max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white p-5 border-b z-10 flex items-center">
                    {logo && (
                        <img
                            src={logo}
                            alt="Service Logo"
                            className="h-10 w-auto object-contain" // Maintains aspect ratio
                        />
                    )}
                    <div className="ml-3">
                        <h2 className="text-lg sm:text-xl font-semibold">
                            Report This Service
                        </h2>
                        <p className="text-sm text-gray-600">
                            Select a reason for reporting this service. Your
                            report helps keep the platform safe.
                        </p>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-5 space-y-3">
                    {[
                        {
                            label: "Scam/Fraud",
                            desc: "This service is involved in fraudulent activities.",
                        },
                        {
                            label: "Misleading Information",
                            desc: "The details listed for this service are incorrect.",
                        },
                        {
                            label: "Fake Service",
                            desc: "This service does not exist or is misleading users.",
                        },
                        {
                            label: "Other",
                            desc: "Specify your own reason below.",
                        },
                    ].map(({ label, desc }) => (
                        <label key={label} className="block">
                            <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-100 transition">
                                <input
                                    type="radio"
                                    value={label}
                                    checked={reportReason === label}
                                    onChange={(e) =>
                                        setReportReason(e.target.value)
                                    }
                                    className="mt-1.5 form-radio text-green-500 focus:ring-green-500"
                                />
                                <div>
                                    <span className="font-medium text-gray-800">
                                        {label}
                                    </span>
                                    <p className="text-sm text-gray-600">
                                        {desc}
                                    </p>
                                </div>
                            </div>
                        </label>
                    ))}

                    {/* Custom Input for "Other" Option */}
                    {reportReason === "Other" && (
                        <textarea
                            ref={inputRef} // Assign ref here
                            placeholder="Describe the issue..."
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                            className="w-full mt-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows="3"
                        />
                    )}
                </div>

                {/* Sticky Buttons */}
                <div className="sticky bottom-0 bg-white p-4 border-t flex justify-between sm:justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-800 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition"
                    >
                        Submit Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModalSev;
