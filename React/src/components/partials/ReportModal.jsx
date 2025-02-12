import React, { useState, useRef, useEffect } from "react";
import logo from "../../images/EmailVertDark.png";
import { useAlert } from "../partials/AlertContext";

const ReportModal = ({ onClose }) => {
    const [reportReason, setReportReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const inputRef = useRef(null); // Ref for the input field
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

        console.log("Report Submitted:", finalReason);
        onClose(); // Close modal after submission
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 z-50">
            <div className="bg-white scroll-thin rounded-lg shadow-xl w-full max-w-md sm:max-w-lg relative max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white p-5 border-b z-10 flex items-center">
                    {logo && (
                        <img
                            src={logo}
                            alt="Business Logo"
                            className="h-10 w-auto object-contain" // Maintains aspect ratio
                        />
                    )}
                    <div className="ml-3">
                        <h2 className="text-lg sm:text-xl font-semibold">
                            Report This Business
                        </h2>
                        <p className="text-sm text-gray-600">
                            Select a reason for reporting this business. Your
                            report helps keep the platform safe.
                        </p>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-5 space-y-3">
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
                        className="px-4 py-2 text-white bg-green rounded-lg hover:bg-green-600 transition"
                    >
                        Submit Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
