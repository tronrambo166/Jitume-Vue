import React, { useState } from "react";
import { FileText, X } from "lucide-react";
import { ENGAGEMENT_TYPES } from "../constants";
import SmartCheckboxGroup from "../SmartCheckboxGroup";

const EngagementStep = ({ formData, handleMultiSelect, handleFileChange }) => {
    // State to track file upload errors
    const [uploadError, setUploadError] = useState("");

    // Handle file selection
    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);

        // Reset previous errors
        setUploadError("");

        // Check file count
        if (files.length + (formData.investmentGuidelines?.length || 0) > 5) {
            setUploadError("Maximum of 5 files allowed");
            return;
        }

        // Check file types and sizes
        const validFiles = files.filter((file) => {
            const isValidType = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ].includes(file.type);

            const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

            return isValidType && isValidSize;
        });

        // Filter out invalid files
        const invalidFiles = files.filter(
            (file) =>
                ![
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ].includes(file.type) || file.size > 10 * 1024 * 1024
        );

        // Set error for invalid files
        if (invalidFiles.length > 0) {
            setUploadError(
                "Some files are invalid. Only PDF and DOCX files up to 10MB are allowed."
            );
        }

        // Call the file change handler with valid files
        handleFileChange(validFiles);
    };

    // Remove a specific file
    const removeFile = (fileToRemove) => {
        const updatedFiles = (formData.investmentGuidelines || []).filter(
            (file) => file !== fileToRemove
        );
        handleFileChange(updatedFiles);
    };

    return (
        <div className="space-y-8">
            {/* Engagement Types Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <SmartCheckboxGroup
                    label="Select Your Preferred Engagement Types"
                    name="engagementTypes"
                    options={ENGAGEMENT_TYPES.map((opt) => opt.value)}
                    selectedOptions={formData.engagementTypes}
                    onChange={(value) =>
                        handleMultiSelect("engagementTypes", value)
                    }
                />
            </div>

            {/* File Upload Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        Investment Guidelines
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Upload your investment guidelines document (PDF only)
                    </p>
                </div>

                {/* File Upload Input */}
                <div className="mt-2">
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-8 pb-6">
                            <FileText className="w-10 h-10 mb-4 text-gray-400" />
                            <div className="text-center">
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold text-green-600">
                                        Click to upload
                                    </span>{" "}
                                    or drag and drop
                                </p>
                                <p className="text-xs text-gray-400">
                                    PDF, DOCX (Max. 5 files, 10MB each)
                                </p>
                            </div>
                        </div>
                        <input
                            id="investment-guidelines"
                            name="investment-guidelines"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileSelect}
                            multiple
                            className="hidden"
                        />
                    </label>

                    {/* Error Message */}
                    {uploadError && (
                        <div className="mt-2 text-sm text-red-600 text-center">
                            {uploadError}
                        </div>
                    )}
                </div>

                {/* Uploaded Files List */}
                {formData.investmentGuidelines &&
                    formData.investmentGuidelines.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {formData.investmentGuidelines.map(
                                (file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-green-50 p-3 rounded-lg"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <FileText className="h-5 w-5 text-green-600" />
                                            <span className="text-sm font-medium text-green-800 truncate max-w-xs">
                                                {file.name}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(file)}
                                            className="text-green-600 hover:text-green-500"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    )}
            </div>
        </div>
    );
};

export default EngagementStep;
