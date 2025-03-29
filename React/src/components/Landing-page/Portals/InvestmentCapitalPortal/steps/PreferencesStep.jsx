import React from "react";
<<<<<<< HEAD
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
=======
import { SECTOR_OPTIONS, STAGE_OPTIONS, REGION_OPTIONS } from "../constants";
import SmartCheckboxGroup from "../SmartCheckboxGroup";

const PreferencesStep = ({
    formData,
    handleMultiSelect,
    handleRangeChange,
}) => {
    // Generate marks for the slider (every $100k)
    const marks = [1, 100000, 200000, 300000, 400000, 500000];

    return (
        <div className="space-y-6">
            {/* Preferred Sectors */}
            <SmartCheckboxGroup
                label="Preferred Sectors"
                name="preferredSectors"
                options={SECTOR_OPTIONS.map((opt) => opt.value)}
                selectedOptions={formData.preferredSectors}
                onChange={(value) =>
                    handleMultiSelect("preferredSectors", value)
                }
            />

            {/* Startup Stage Preferences */}
            <SmartCheckboxGroup
                label="Startup Stage Preferences"
                name="startupStagePreferences"
                options={STAGE_OPTIONS.map((opt) => opt.value)}
                selectedOptions={formData.startupStagePreferences}
                onChange={(value) =>
                    handleMultiSelect("startupStagePreferences", value)
                }
            />

            {/* Enhanced Investment Range Slider */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <label className="block text-lg font-medium text-gray-900 mb-4">
                    Investment Range (USD)
                </label>

                <div className="space-y-8">
                    {/* Min Investment */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                Minimum
                            </span>
                            <span className="text-sm font-semibold text-green-600">
                                ${formData.investmentRange.min.toLocaleString()}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="500000"
                            step="1"
                            value={formData.investmentRange.min}
                            onChange={(e) =>
                                handleRangeChange("min", Number(e.target.value))
                            }
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                        <div className="flex justify-between mt-1">
                            {marks.map((mark) => (
                                <span
                                    key={`min-mark-${mark}`}
                                    className="text-xs text-gray-500"
                                >
                                    ${mark.toLocaleString()}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Max Investment */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                Maximum
                            </span>
                            <span className="text-sm font-semibold text-green-600">
                                ${formData.investmentRange.max.toLocaleString()}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="500000"
                            step="1"
                            value={formData.investmentRange.max}
                            onChange={(e) =>
                                handleRangeChange("max", Number(e.target.value))
                            }
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                        <div className="flex justify-between mt-1">
                            {marks.map((mark) => (
                                <span
                                    key={`max-mark-${mark}`}
                                    className="text-xs text-gray-500"
                                >
                                    ${mark.toLocaleString()}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Geographic Focus */}
            <SmartCheckboxGroup
                label="Geographic Focus"
                name="geographicFocus"
                options={REGION_OPTIONS.map((opt) => opt.value)}
                selectedOptions={formData.geographicFocus}
                onChange={(value) =>
                    handleMultiSelect("geographicFocus", value)
                }
            />
        </div>
    );
};

export default PreferencesStep;
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
