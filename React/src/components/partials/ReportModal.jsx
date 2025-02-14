import React, { useState, useRef, useEffect } from "react";
import { FaUpload, FaTimes, FaFilePdf } from "react-icons/fa";
import logo from "../../images/EmailVertDark.png";
import { useAlert } from "../partials/AlertContext";
import axiosClient from "../../axiosClient";

const ReportModal = ({ onClose, listing_id }) => {
    const [reportReason, setReportReason] = useState("");
    const [details, setDetails] = useState({});
    const [files, setFiles] = useState({});
    const [filePreviews, setFilePreviews] = useState({});
    const inputRefs = useRef({});
    const { showAlert } = useAlert();

    const reportOptions = [
        "Misleading or False Information",
        "Scam or Fraudulent Activity",
        "Intellectual Property Violation", 
        "Spam or Irrelevant Content",
        "Inappropriate Content",
        "Other", 
    ];

    useEffect(() => {
        if (reportReason && inputRefs.current[reportReason]) {
            inputRefs.current[reportReason].scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            inputRefs.current[reportReason].focus();
        }
    }, [reportReason]);

    const handleFileChange = (e, reason) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFiles({ ...files, [reason]: uploadedFile });

            // Check if the file is an image
            const fileType = uploadedFile.type;
            if (fileType.startsWith("image/")) {
                setFilePreviews({
                    ...filePreviews,
                    [reason]: URL.createObjectURL(uploadedFile),
                });
            } else {
                setFilePreviews({ ...filePreviews, [reason]: "pdf" }); // Use 'pdf' as an identifier
            }
        }
    };

    const handleSubmit = async () => {
        if (!reportReason) return showAlert("info", "Please select a reason.");

        const finalDetails = details[reportReason] || "";
        const formData = new FormData();
        formData.append("listing_id", listing_id);
        formData.append("details", finalDetails);
        formData.append("category", reportReason);
        if (files[reportReason])
            formData.append("document", files[reportReason]);

        try {
            const { data } = await axiosClient.post("submitReport", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            data.status === 200
                ? showAlert("success", data.message)
                : showAlert("error", data.message);
        } catch (err) {
            console.error("Error submitting report:", err);
            showAlert("error", "Failed to submit report. Please try again.");
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 z-50">
            <div className="bg-white scroll-thin rounded-lg shadow-xl w-full max-w-md sm:max-w-lg relative max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white p-5 border-b z-10 flex items-center">
                    <img
                        src={logo}
                        alt="Tujitume Logo"
                        className="h-10 w-auto object-contain"
                    />
                    <div className="ml-3">
                        <h2 className="text-lg sm:text-xl font-semibold">
                            Report This Business
                        </h2>
                        <p className="text-sm text-gray-600">
                            Help keep Tujitume safe by reporting inappropriate
                            content.
                        </p>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-5 space-y-3">
                    {reportOptions.map((label) => (
                        <div
                            key={label}
                            className="p-3 border rounded-lg hover:bg-gray-100 transition"
                        >
                            <label className="flex items-start space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    value={label}
                                    checked={reportReason === label}
                                    onChange={(e) =>
                                        setReportReason(e.target.value)
                                    }
                                    className="mt-1.5 form-radio text-green focus:ring-green-500"
                                />
                                <span className="font-medium text-gray-800">
                                    {label}
                                </span>
                            </label>

                            {/* Text Input & File Upload (Only When Selected) */}
                            {reportReason === label && (
                                <div className="mt-2 relative">
                                    {/* Text Input */}
                                    <textarea
                                        ref={(el) =>
                                            (inputRefs.current[label] = el)
                                        }
                                        placeholder="Provide more details..."
                                        value={details[label] || ""}
                                        onChange={(e) =>
                                            setDetails({
                                                ...details,
                                                [label]: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
                                        rows="2"
                                    />

                                    {/* Optional Upload Instruction */}
                                    <p className="text-sm text-gray-500 mt-1">
                                        Uploading evidence (PDF, image, etc.) is
                                        optional.
                                    </p>

                                    {/* Upload Icon (Bottom Right) */}
                                    <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                                        <label
                                            htmlFor={`fileUpload-${label}`}
                                            className="cursor-pointer"
                                        >
                                            <FaUpload className="text-green text-lg" />
                                        </label>
                                        <input
                                            id={`fileUpload-${label}`}
                                            type="file"
                                            accept="image/*,application/pdf"
                                            onChange={(e) =>
                                                handleFileChange(e, label)
                                            }
                                            className="hidden"
                                        />
                                    </div>

                                    {/* File Preview */}
                                    {filePreviews[label] && (
                                        <div className="mt-2 relative">
                                            {filePreviews[label] === "pdf" ? (
                                                <div className="flex items-center space-x-2 p-2 border rounded-lg bg-gray-100">
                                                    <FaFilePdf className="text-red-500 text-xl" />
                                                    <span className="text-sm text-gray-800">
                                                        {files[label]?.name}
                                                    </span>
                                                </div>
                                            ) : (
                                                <img
                                                    src={filePreviews[label]}
                                                    alt="Preview"
                                                    className="w-16 h-16 object-cover rounded-lg shadow-md"
                                                />
                                            )}

                                            {/* Remove File Button */}
                                            <button
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                                                onClick={() => {
                                                    setFiles({
                                                        ...files,
                                                        [label]: null,
                                                    });
                                                    setFilePreviews({
                                                        ...filePreviews,
                                                        [label]: null,
                                                    });
                                                }}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
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
                        className="px-4 py-2 text-white bg-green rounded-lg hover:bg-green-700 transition"
                    >
                        Submit Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
