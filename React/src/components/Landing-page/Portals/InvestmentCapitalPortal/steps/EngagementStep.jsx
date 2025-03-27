import React from "react";
import { FileText } from "lucide-react";
import { ENGAGEMENT_TYPES } from "../constants";

const EngagementStep = ({
  formData,
  handleMultiSelect,
  handleFileChange,
}) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Engagement Types
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ENGAGEMENT_TYPES.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="checkbox"
                id={`engagement-${option.value}`}
                checked={formData.engagementTypes.includes(option.value)}
                onChange={() =>
                  handleMultiSelect("engagementTypes", option.value)
                }
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor={`engagement-${option.value}`}
                className="ml-2 block text-sm text-gray-900"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Investment Guidelines (PDF)
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileText className="w-8 h-8 mb-4 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">PDF (max. 5MB)</p>
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        {formData.investmentGuidelines && (
          <p className="mt-2 text-sm text-green-600">
            {formData.investmentGuidelines.name}
          </p>
        )}
      </div>
    </>
  );
};

export default EngagementStep;