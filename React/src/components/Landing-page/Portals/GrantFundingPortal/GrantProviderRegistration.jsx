import React, { useState } from "react";
import { useAlert } from "../../../partials/AlertContext";
import FormInput from "./components/FormInput";
import FormSelect from "./components/FormSelect";
import CheckboxGroup from "./components/CheckboxGroup";
import FormTextarea from "./components/FormTextarea";
import TermsCheckbox from "./components/TermsCheckbox";
import StepperIndicator from "./components/StepperIndicator";
import {
    ORGANIZATION_TYPES,
    FOCUS_SECTOR_OPTIONS,
    TARGET_REGION_OPTIONS,
    INITIAL_FORM_DATA,
} from "./registrationOptions";

const GrantProviderRegistration = () => {
    const { showAlert } = useAlert();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSectorChange = (sector) => {
        setFormData((prev) => {
            const currentSectors = prev.focusSectors;
            const newSectors = currentSectors.includes(sector)
                ? currentSectors.filter((s) => s !== sector)
                : [...currentSectors, sector];

            return {
                ...prev,
                focusSectors: newSectors,
            };
        });
    };

    const handleRegionChange = (region) => {
        setFormData((prev) => {
            const currentRegions = prev.targetRegions;
            const newRegions = currentRegions.includes(region)
                ? currentRegions.filter((r) => r !== region)
                : [...currentRegions, region];

            return {
                ...prev,
                targetRegions: newRegions,
            };
        });
    };

    const validateStep = () => {
        switch (currentStep) {
            case 1:
                return formData.organizationName && formData.organizationType;
            case 2:
                return formData.email && formData.phoneNumber;
            case 3:
                return (
                    formData.password &&
                    formData.confirmPassword &&
                    formData.password === formData.confirmPassword
                );
            case 4:
                return (
                    formData.focusSectors.length > 0 &&
                    formData.targetRegions.length > 0
                );
            case 5:
                return formData.missionStatement && formData.termsAgreed;
            default:
                return false;
        }
    };

    const nextStep = () => {
        if (validateStep()) {
            setCurrentStep((prev) => Math.min(prev + 1, 6));
        } else {
            showAlert("error", "Please fill in all required fields correctly.");
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateStep()) {
            showAlert("error", "Please complete all steps before submitting.");
            return;
        }

        console.log("Form Data Submitted:", formData);
        showAlert("success", "Registration successful!");
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <FormInput
                            label="Organization Name"
                            type="text"
                            name="organizationName"
                            value={formData.organizationName}
                            onChange={handleInputChange}
                            placeholder="Enter your organization name"
                        />
                        <FormSelect
                            label="Organization Type"
                            name="organizationType"
                            value={formData.organizationType}
                            onChange={handleInputChange}
                            options={ORGANIZATION_TYPES}
                        />
                    </>
                );
            case 2:
                return (
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormInput
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                        />
                        <FormInput
                            label="Phone Number"
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                        />
                    </div>
                );
            case 3:
                return (
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
                );
            case 4:
                return (
                    <>
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
            case 5:
                return (
                    <>
                        <FormTextarea
                            label="Mission/Impact Statement"
                            name="missionStatement"
                            value={formData.missionStatement}
                            onChange={handleInputChange}
                            placeholder="Describe your organization's mission and impact"
                        />
                        <TermsCheckbox
                            checked={formData.termsAgreed}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    termsAgreed: e.target.checked,
                                }))
                            }
                        />
                    </>
                );
            case 6:
                return (
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-green mb-4">
                            Registration Summary
                        </h3>
                        <div className="bg-gray-100 p-4 rounded-lg text-left">
                            <p>
                                <strong>Organization:</strong>{" "}
                                {formData.organizationName}
                            </p>
                            <p>
                                <strong>Type:</strong>{" "}
                                {formData.organizationType}
                            </p>
                            <p>
                                <strong>Email:</strong> {formData.email}
                            </p>
                            <p>
                                <strong>Focus Sectors:</strong>{" "}
                                {formData.focusSectors.join(", ")}
                            </p>
                            <p>
                                <strong>Target Regions:</strong>{" "}
                                {formData.targetRegions.join(", ")}
                            </p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="p-6 bg-white rounded-lg max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center text-green">
                    Registration
                </h2>

                <StepperIndicator currentStep={currentStep} />

                <form onSubmit={handleSubmit} className="space-y-4">
                    {renderStepContent()}

                    <div className="flex justify-between mt-6">
                        {currentStep > 1 && currentStep < 6 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="py-2 px-4 bg-gray-300 text-black font-semibold rounded-md hover:bg-gray-400"
                            >
                                Previous
                            </button>
                        )}

                        {currentStep < 6 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="ml-auto py-2 px-4 bg-green text-white font-semibold rounded-md hover:bg-green-600"
                            >
                                {currentStep === 5 ? "Review" : "Next"}
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-green text-white font-semibold rounded-md hover:bg-green-600"
                            >
                                Complete Registration
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
};

export default GrantProviderRegistration;
