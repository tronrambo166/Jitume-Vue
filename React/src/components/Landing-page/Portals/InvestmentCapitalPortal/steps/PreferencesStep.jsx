import React from "react";
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
