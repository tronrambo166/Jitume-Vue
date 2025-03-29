import React, { useState } from "react";
import { FileText ,Eye } from "lucide-react";
import DocumentPreviewModal from "./DocumentPreviewModal";

const RegistrationSummary = ({ formData, onTermsChange }) => {
    const [selectedDocument, setSelectedDocument] = useState(null);

    const openDocumentPreview = (file) => {
        setSelectedDocument(file);
    };

    const closeDocumentPreview = () => {
        setSelectedDocument(null);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white border rounded-lg overflow-hidden">
            <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                <h2 className="text-2xl font-bold text-green-800 text-center">
                    Registration Summary
                </h2>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">
                            Organization
                        </p>
                        <p className="font-medium text-gray-800">
                            {formData.organizationName}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">
                            Organization Type
                        </p>
                        <p className="font-medium text-gray-800">
                            {formData.organizationType}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">
                            Email
                        </p>
                        <p className="font-medium text-gray-800">
                            {formData.email}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">
                            Phone
                        </p>
                        <p className="font-medium text-gray-800">
                            {formData.phoneNumber || "Not provided"}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                        Focus Sectors
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {formData.focusSectors.map((sector, index) => (
                            <span
                                key={index}
                                className="px-2.5 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                            >
                                {sector}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 font-semibold mb-2">
                        Target Regions
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {formData.targetRegions.map((region, index) => (
                            <span
                                key={index}
                                className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                                {region}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 font-semibold mb-2">
                        Mission Statement
                    </p>
                    <p className="font-medium text-gray-800 whitespace-pre-line">
                        {formData.missionStatement}
                    </p>
                </div>

                {formData.organizationDocuments?.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Uploaded Documents
                        </h3>
                        <div className="space-y-2">
                            {formData.organizationDocuments.map(
                                (file, index) => (
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
                                                    {(file.size / 1024).toFixed(
                                                        2
                                                    )}{" "}
                                                    KB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openDocumentPreview(file)
                                            }
                                            className="flex items-center text-sm text-green-600 hover:text-green-800"
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            Preview
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}
                {formData.website && (
                    <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">
                            Website
                        </p>
                        <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-500 mr-2" />
                            <a
                                href={
                                    formData.website.startsWith("http")
                                        ? formData.website
                                        : `https://${formData.website}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-green-600 hover:underline"
                            >
                                {formData.website}
                            </a>
                        </div>
                    </div>
                )}

                <div className="border-t pt-4">
                    <div className="flex items-start">
                        <input
                            type="checkbox"
                            id="terms-checkbox"
                            checked={formData.termsAgreed}
                            onChange={onTermsChange}
                            className="mt-1 mr-2 rounded text-green-600 focus:ring-green-500"
                        />
                        <label
                            htmlFor="terms-checkbox"
                            className="text-sm text-gray-700"
                        >
                            I agree to the terms and conditions
                            <p className="text-xs text-gray-500 mt-1">
                                By checking this box, you acknowledge that you
                                have read and agree to our Terms of Service and
                                Privacy Policy.
                            </p>
                        </label>
                    </div>
                </div>
            </div>

            <DocumentPreviewModal
                file={selectedDocument}
                isOpen={!!selectedDocument}
                onClose={closeDocumentPreview}
            />
        </div>
    );
};

export default RegistrationSummary;
