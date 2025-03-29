// components/steps/Step2.js
import React from "react";
import FormInput from "../FormInput";
import CheckboxGroup from "../CheckboxGroup";
import {
    FOCUS_SECTOR_OPTIONS,
    TARGET_REGION_OPTIONS,
} from "../../registrationOptions";
const Step2 = ({
    formData,
    handleInputChange,
    handleSectorChange,
    handleRegionChange,
}) => (
    <>
        <div className="grid md:grid-cols-2 gap-4">
            <FormInput
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
            />
            <FormInput
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
            />
        </div>
        <CheckboxGroup
            label="Focus Sectors"
            name="focusSectors"
            options={FOCUS_SECTOR_OPTIONS}
            selectedOptions={formData.focusSectors}
            onChange={handleSectorChange}
        />
        <CheckboxGroup
            label="Target Regions"
            name="targetRegions"
            options={TARGET_REGION_OPTIONS}
            selectedOptions={formData.targetRegions}
            onChange={handleRegionChange}
        />
    </>
);

export default Step2;
