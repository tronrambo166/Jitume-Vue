import React, { useState } from "react";
import {
    INVESTOR_TYPES,
    SECTOR_OPTIONS,
    REGION_OPTIONS,
    ENGAGEMENT_TYPES,
} from "../constants";
import { FileText, Eye, Globe } from "lucide-react";
import DocumentPreviewModal from "./DocumentPreviewModal";

const SummaryStep = ({ formData, setFormData }) => {
    const [previewFile, setPreviewFile] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handlePreview = (file) => {
        setPreviewFile(file);
        setIsPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setIsPreviewOpen(false);
        setPreviewFile(null);
    };

    return (
        <div className="space-y-6">
            {previewFile && (
                <DocumentPreviewModal
                    file={previewFile}
                    isOpen={isPreviewOpen}
                    onClose={handleClosePreview}
                />
            )}

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                    <h2 className="text-2xl font-bold text-green-800 text-center">
                        Registration Summary
                    </h2>
                </div>

                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Investor Name
                            </p>
                            <p className="text-gray-900 font-semibold">
                                {formData.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Investor Type
                            </p>
                            <p className="text-gray-900 font-semibold">
                                {INVESTOR_TYPES.find(
                                    (t) => t.value === formData.investorType
                                )?.label || "Not specified"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Email
                            </p>
                            <p className="text-gray-900 font-semibold">
                                {formData.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Phone
                            </p>
                            <p className="text-gray-900 font-semibold">
                                {formData.phone || "Not provided"}
                            </p>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Investment Preferences
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Preferred Sectors
                                </p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {formData.preferredSectors.length > 0 ? (
                                        formData.preferredSectors.map(
                                            (s, index) => {
                                                const sectorLabel =
                                                    SECTOR_OPTIONS.find(
                                                        (o) => o.value === s
                                                    )?.label || s;
                                                return (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                                                    >
                                                        {sectorLabel}
                                                    </span>
                                                );
                                            }
                                        )
                                    ) : (
                                        <p className="text-gray-500 text-sm">
                                            None selected
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Investment Range
                                </p>
                                <p className="text-gray-900 font-semibold">
                                    $
                                    {formData.investmentRange.min.toLocaleString()}{" "}
                                    - $
                                    {formData.investmentRange.max.toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Geographic Focus
                                </p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {formData.geographicFocus.length > 0 ? (
                                        formData.geographicFocus.map(
                                            (r, index) => {
                                                const regionLabel =
                                                    REGION_OPTIONS.find(
                                                        (o) => o.value === r
                                                    )?.label || r;
                                                return (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                                                    >
                                                        {regionLabel}
                                                    </span>
                                                );
                                            }
                                        )
                                    ) : (
                                        <p className="text-gray-500 text-sm">
                                            None selected
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Startup Stage Preferences
                                </p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {formData.startupStagePreferences.length >
                                    0 ? (
                                        formData.startupStagePreferences.map(
                                            (stage, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1.5 bg-gray-100 text-gray-800 text-xs font-medium rounded-full"
                                                >
                                                    {stage}
                                                </span>
                                            )
                                        )
                                    ) : (
                                        <p className="text-gray-500 text-sm">
                                            None selected
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Engagement Preferences
                        </h3>
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Preferred Engagement Types
                            </p>
                            <p className="text-gray-900">
                                {formData.engagementTypes
                                    .map(
                                        (type) =>
                                            ENGAGEMENT_TYPES.find(
                                                (et) => et.value === type
                                            )?.label
                                    )
                                    .join(", ") || "None selected"}
                            </p>
                        </div>
                    </div>
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Investment Guidelines
                        </h3>
                        {formData.investmentGuidelines.length > 0 ? (
                            <div className="space-y-2">
                                {formData.investmentGuidelines.map(
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
                                                        {(
                                                            file.size / 1024
                                                        ).toFixed(2)}{" "}
                                                        KB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handlePreview(file)
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
                        ) : (
                            <p className="text-gray-900">No files uploaded</p>
                        )}
                    </div>
                    {formData.website && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-600 mb-1">
                                Website
                            </p>
                            <div className="flex items-center">
                                <Globe className="h-4 w-4 text-gray-500 mr-2" />
                                <a
                                    href={
                                        formData.website.startsWith("http")
                                            ? formData.website
                                            : `https://${formData.website}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:underline font-medium"
                                >
                                    {formData.website}
                                </a>
                            </div>
                        </div>
                    )}
                    <div className="border-t pt-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="terms-agreement"
                                checked={formData.termsAgreed}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        termsAgreed: e.target.checked,
                                    }))
                                }
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-3"
                            />
                            <label
                                htmlFor="terms-agreement"
                                className="text-sm text-gray-900"
                            >
                                I agree to the Terms and Conditions
                            </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            By creating an account, you agree to our investment
                            platform terms.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryStep;
