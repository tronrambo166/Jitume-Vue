import React from "react";
import {
  INVESTOR_TYPES,
  SECTOR_OPTIONS,
  REGION_OPTIONS,
} from "../constants";

const SummaryStep = ({ formData, setFormData }) => {
  return (
    <>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Registration Summary</h3>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Investor Name:</strong> {formData.name}
          </p>
          <p>
            <strong>Investor Type:</strong>{" "}
            {INVESTOR_TYPES.find((t) => t.value === formData.investorType)
              ?.label || "Not specified"}
          </p>
          <p>
            <strong>Email:</strong> {formData.email}
          </p>
          <p>
            <strong>Preferred Sectors:</strong>{" "}
            {formData.preferredSectors
              .map((s) => SECTOR_OPTIONS.find((o) => o.value === s)?.label)
              .join(", ") || "None selected"}
          </p>
          <p>
            <strong>Investment Range:</strong> $
            {formData.investmentRange.min.toLocaleString()} - $
            {formData.investmentRange.max.toLocaleString()}
          </p>
          <p>
            <strong>Geographic Focus:</strong>{" "}
            {formData.geographicFocus
              .map((r) => REGION_OPTIONS.find((o) => o.value === r)?.label)
              .join(", ") || "None selected"}
          </p>
        </div>
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            checked={formData.termsAgreed}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                termsAgreed: e.target.checked,
              }))
            }
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="font-medium text-gray-700">
            I agree to the{" "}
            <a href="#" className="text-green-600 hover:text-green-500">
              Terms and Conditions
            </a>
          </label>
          <p className="text-gray-500">
            By creating an account, you agree to our investment platform terms.
          </p>
        </div>
      </div>
    </>
  );
};

export default SummaryStep;