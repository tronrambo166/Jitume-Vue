import React, { useState } from "react";
import Stepper from "./Stepper";
import BasicInfoStep from "./steps/BasicInfoStep";
import PasswordStep from "./steps/PasswordStep";
import PreferencesStep from "./steps/PreferencesStep";
import EngagementStep from "./steps/EngagementStep";
import SummaryStep from "./steps/SummaryStep";

const InvestorRegisterForm = ({ onSwitchToLogin }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        // Step 1: Basic Info
        name: "",
        investorType: "",
        email: "",
        phone: "",

        // Step 2: Password
        password: "",
        confirmPassword: "",

        // Step 3: Investment Preferences
        preferredSectors: [],
        startupStagePreferences: [],
        investmentRange: { min: 25000, max: 100000 },
        geographicFocus: [],

        // Step 4: Engagement & Files
        engagementTypes: [],
        investmentGuidelines: null,

        // Step 5: Terms
        termsAgreed: false,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            investmentGuidelines: e.target.files[0],
        }));
    };

    const handleMultiSelect = (field, value) => {
        setFormData((prev) => {
            const currentValues = prev[field];
            const newValues = currentValues.includes(value)
                ? currentValues.filter((item) => item !== value)
                : [...currentValues, value];
            return { ...prev, [field]: newValues };
        });
    };

    const handleRangeChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            investmentRange: {
                ...prev.investmentRange,
                [field]: parseInt(value),
            },
        }));
    };

    const nextStep = () => {
        // Basic validation before proceeding
        if (
            currentStep === 1 &&
            (!formData.name || !formData.investorType || !formData.email)
        ) {
            alert("Please fill in all required fields");
            return;
        }
        if (
            currentStep === 2 &&
            (!formData.password ||
                formData.password !== formData.confirmPassword)
        ) {
            alert("Please enter matching passwords");
            return;
        }
        setCurrentStep((prev) => Math.min(prev + 1, 5));
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Investor Registration Submitted:", formData);
        // Add your submission logic here
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <BasicInfoStep
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />
                );
            case 2:
                return (
                    <PasswordStep
                        formData={formData}
                        handleInputChange={handleInputChange}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        showConfirmPassword={showConfirmPassword}
                        setShowConfirmPassword={setShowConfirmPassword}
                    />
                );
            case 3:
                return (
                    <PreferencesStep
                        formData={formData}
                        handleMultiSelect={handleMultiSelect}
                        handleRangeChange={handleRangeChange}
                    />
                );
            case 4:
                return (
                    <EngagementStep
                        formData={formData}
                        handleMultiSelect={handleMultiSelect}
                        handleFileChange={handleFileChange}
                    />
                );
            case 5:
                return (
                    <SummaryStep
                        formData={formData}
                        setFormData={setFormData}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                Investor Registration
            </h2>

            <Stepper currentStep={currentStep} totalSteps={5} />

            <div className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {renderStepContent()}

                    <div className="flex justify-between mt-8">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="py-2 px-4 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Back
                            </button>
                        )}

                        {currentStep < 5 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="ml-auto py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Complete Registration
                            </button>
                        )}
                    </div>
                </form>

                {currentStep === 1 && (
                    <div className="text-center text-sm text-gray-600 mt-4">
                        Already have an account?{" "}
                        <button
                            onClick={onSwitchToLogin}
                            className="font-medium text-green-600 hover:text-green-500"
                        >
                            Sign in
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvestorRegisterForm;
