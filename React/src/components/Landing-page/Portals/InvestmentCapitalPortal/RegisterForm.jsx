import React, { useState } from "react";
import Stepper from "./Stepper";
import BasicInfoStep from "./steps/BasicInfoStep";
import PasswordStep from "./steps/PasswordStep";
import PreferencesStep from "./steps/PreferencesStep";
import EngagementStep from "./steps/EngagementStep";
import SummaryStep from "./steps/SummaryStep";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import logo from "../../../../images/Tujitumelogo.svg"; // Adjust path as needed

const InvestorRegisterForm = ({ onSwitchToLogin }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    console.log("Current form data:", formData); // Log form data changes

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Field changed: ${name} = ${value}`); // Log field changes
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log("File selected:", file?.name); // Log file selection
        setFormData((prev) => ({
            ...prev,
            investmentGuidelines: file,
        }));
    };

    const handleMultiSelect = (field, value) => {
        console.log(`Multi-select field ${field} updated with value ${value}`); // Log multi-select changes
        setFormData((prev) => {
            const currentValues = prev[field];
            const newValues = currentValues.includes(value)
                ? currentValues.filter((item) => item !== value)
                : [...currentValues, value];
            return { ...prev, [field]: newValues };
        });
    };

    const handleRangeChange = (field, value) => {
        console.log(`Range changed - ${field}: ${value}`); // Log range changes
        setFormData((prev) => ({
            ...prev,
            investmentRange: {
                ...prev.investmentRange,
                [field]: parseInt(value),
            },
        }));
    };

    const nextStep = () => {
        console.log(`Moving to step ${currentStep + 1}`); // Log step navigation

        // Basic validation before proceeding
        if (
            currentStep === 1 &&
            (!formData.name || !formData.investorType || !formData.email)
        ) {
            console.warn(
                "Validation failed: Missing required fields in step 1"
            );
            alert("Please fill in all required fields");
            return;
        }

        if (
            currentStep === 2 &&
            (!formData.password ||
                formData.password !== formData.confirmPassword)
        ) {
            console.warn("Validation failed: Password mismatch in step 2");
            alert("Please enter matching passwords");
            return;
        }

        setCurrentStep((prev) => Math.min(prev + 1, 5));
    };

    const prevStep = () => {
        console.log(`Moving back to step ${currentStep - 1}`); // Log step navigation
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Starting form submission..."); // Log submission start

        if (!formData.termsAgreed) {
            console.warn("Submission failed: Terms not agreed");
            alert("Please agree to the terms and conditions");
            return;
        }

        setIsSubmitting(true);
        console.log("Form data being submitted:", formData); // Log complete form data

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log("Form submitted successfully!"); // Log success
            // Add your actual submission logic here
        } catch (error) {
            console.error("Submission error:", error); // Log errors
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        console.log(`Rendering step ${currentStep} content`); // Log step rendering
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
            {/* Logo added here */}
            <div className="flex justify-center mb-4">
                <img src={logo} alt="Company Logo" className="h-16" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                Investor Registration
            </h2>

            <Stepper currentStep={currentStep} totalSteps={5} />

            <div className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {renderStepContent()}

                    <div className="flex justify-between mt-6">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="py-2 px-4 bg-gray-400 text-gray-700 font-medium rounded-md shadow-sm hover:bg-gray-200 transition-all focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                Back
                            </button>
                        )}

                        <button
                            type={currentStep < 5 ? "button" : "submit"}
                            onClick={currentStep < 5 ? nextStep : undefined}
                            className="py-2 px-5 bg-green-600 text-white font-medium rounded-md shadow-md hover:bg-green-700 transition-all focus:ring-2 focus:ring-green-500 flex items-center justify-center disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 mr-2" />
                                    Processing...
                                </>
                            ) : currentStep < 5 ? (
                                "Next"
                            ) : (
                                "Finish"
                            )}
                        </button>
                    </div>
                </form>

                {currentStep === 1 && (
                    <div className="text-center text-sm text-gray-600 mt-4">
                        Already have an account?{" "}
                        <button
                            onClick={onSwitchToLogin}
                            className="font-medium text-green-600 hover:text-green-500 focus:ring-2 focus:ring-green-400"
                            disabled={isSubmitting}
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
