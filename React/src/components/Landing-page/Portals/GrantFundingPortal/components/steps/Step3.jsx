import React, { useState } from "react";
import { FileText, Trash2 } from "lucide-react";
import FormTextarea from "../FormTextarea";

const Step3 = ({ formData, handleInputChange, handleFileUpload }) => {
    const [uploadedFiles, setUploadedFiles] = useState(
        formData.organizationDocuments || []
    );

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.filter(
            (file) =>
                !uploadedFiles.some(
                    (existingFile) => existingFile.name === file.name
                )
        );

        const updatedFiles = [...uploadedFiles, ...newFiles];
        setUploadedFiles(updatedFiles);

        if (handleFileUpload) {
            handleFileUpload(updatedFiles);
        }
    };

    const removeFile = (fileName) => {
        const filteredFiles = uploadedFiles.filter(
            (file) => file.name !== fileName
        );
        setUploadedFiles(filteredFiles);
        handleFileUpload(filteredFiles);
    };

    return (
        <div className="space-y-4">
            <FormTextarea
                label="Mission/Impact Statement"
                name="missionStatement"
                value={formData.missionStatement}
                onChange={handleInputChange}
                placeholder="Describe your organization's mission and impact"
            />

            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Documents (Optional)
                </label>
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col border-4 border-dashed w-full h-32 hover:bg-gray-100 hover:border-green group relative">
                        <div className="flex flex-col items-center justify-center pt-7 cursor-pointer">
                            <FileText className="w-12 h-12 text-gray-400 group-hover:text-green" />
                            <p className="lowercase text-sm text-gray-400 group-hover:text-green pt-2 text-center">
                                Click to upload
                            </p>
                        </div>
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.jpg,.png"
                        />
                    </label>
                </div>
                
                {uploadedFiles.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Uploaded Files
                        </h3>
                        <div className="space-y-2">
                            {uploadedFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between bg-green-50 p-3 rounded-lg"
                                >
                                    <div className="flex items-center">
                                        <FileText className="h-5 w-5 text-green-600 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {(file.size / 1024).toFixed(2)}{" "}
                                                KB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(file.name)}
                                        className="flex items-center text-sm text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Step3;
