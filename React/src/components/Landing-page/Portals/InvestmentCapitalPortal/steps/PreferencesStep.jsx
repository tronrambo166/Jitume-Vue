import React from "react";
import {
  SECTOR_OPTIONS,
  STAGE_OPTIONS,
  REGION_OPTIONS,
} from "../constants";

const PreferencesStep = ({
  formData,
  handleMultiSelect,
  handleRangeChange,
}) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preferred Sectors
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SECTOR_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="checkbox"
                id={`sector-${option.value}`}
                checked={formData.preferredSectors.includes(option.value)}
                onChange={() =>
                  handleMultiSelect("preferredSectors", option.value)
                }
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor={`sector-${option.value}`}
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
          Startup Stage Preferences
        </label>
        <div className="grid grid-cols-2 gap-2">
          {STAGE_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="checkbox"
                id={`stage-${option.value}`}
                checked={formData.startupStagePreferences.includes(option.value)}
                onChange={() =>
                  handleMultiSelect("startupStagePreferences", option.value)
                }
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor={`stage-${option.value}`}
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
          Investment Range (USD)
        </label>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-xs text-gray-500">Min</label>
            <input
              type="range"
              min="10000"
              max="500000"
              step="5000"
              value={formData.investmentRange.min}
              onChange={(e) => handleRangeChange("min", e.target.value)}
              className="w-full"
            />
            <div className="text-center">
              ${formData.investmentRange.min.toLocaleString()}
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500">Max</label>
            <input
              type="range"
              min="10000"
              max="500000"
              step="5000"
              value={formData.investmentRange.max}
              onChange={(e) => handleRangeChange("max", e.target.value)}
              className="w-full"
            />
            <div className="text-center">
              ${formData.investmentRange.max.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Geographic Focus
        </label>
        <div className="grid grid-cols-2 gap-2">
          {REGION_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="checkbox"
                id={`region-${option.value}`}
                checked={formData.geographicFocus.includes(option.value)}
                onChange={() =>
                  handleMultiSelect("geographicFocus", option.value)
                }
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor={`region-${option.value}`}
                className="ml-2 block text-sm text-gray-900"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PreferencesStep;