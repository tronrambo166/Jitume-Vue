import React, { useState } from "react";
import { useAlert } from "../../../partials/AlertContext";
import StepperIndicator from "./components/StepperIndicator";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import logo from "../../../../images/Tujitumelogo.svg";
import { INITIAL_FORM_DATA } from "./registrationOptions";
import Step1 from "./components/steps/Step1";
import Step2 from "./components/steps/Step2";
import Step3 from "./components/steps/Step3";
import RegistrationSummary from "./components/RegistrationSummary";
import axiosClient from "../../../../axiosClient";
import { useStateContext } from "../../../../contexts/contextProvider";

const SignInPrompt = ({ handleBackToLogin, isSubmitting }) => (
    <div className="text-center mb-6">
        <p className="text-gray-600 mt-8">
            Already have an account?{" "}
            <button
                onClick={handleBackToLogin}
                className="font-medium text-green-600 hover:text-green-500"
                disabled={isSubmitting}
            >
                Sign in here
            </button>
        </p>
    </div>
);

const GrantProviderRegistration = ({ handleBackToLogin }) => {
     const { setUser, setToken, token } = useStateContext();
     const { showAlert } = useAlert();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        ...INITIAL_FORM_DATA,
        website: "", // Add website field to initial state
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (files) => {
        setFormData((prev) => ({
            ...prev,
            organizationDocuments: files,
        }));
    };

    const handleSectorChange = (sector) => {
        setFormData((prev) => ({
            ...prev,
            focusSectors: prev.focusSectors.includes(sector)
                ? prev.focusSectors.filter((s) => s !== sector)
                : [...prev.focusSectors, sector],
        }));
    };

    const handleRegionChange = (region) => {
        setFormData((prev) => ({
            ...prev,
            targetRegions: prev.targetRegions.includes(region)
                ? prev.targetRegions.filter((r) => r !== region)
                : [...prev.targetRegions, region],
        }));
    };

    const handleTermsChange = (e) => {
        setFormData((prev) => ({ ...prev, termsAgreed: e.target.checked }));
    };

    const validateStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    formData.organizationName &&
                    formData.organizationType &&
                    formData.email &&
                    formData.phoneNumber
                );
            case 2:
                return (
                    formData.password &&
                    formData.confirmPassword &&
                    formData.password === formData.confirmPassword &&
                    formData.focusSectors.length > 0 &&
                    formData.targetRegions.length > 0
                );
            case 3:
                return formData.missionStatement;
            default:
                return false;
        }
    };

    const nextStep = () => {
        if (validateStep()) {
            setCurrentStep((prev) => Math.min(prev + 1, 4));
        } else {
            showAlert("error", "Please fill in all required fields correctly.");
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Handle step navigation
        if (currentStep < 4) {
            nextStep();
            return;
        }

        setIsSubmitting(true);

        try {
            const submitData = new FormData();

            submitData.append("fname", formData.organizationName);
            submitData.append("org_type", formData.organizationType);
            submitData.append("email", formData.email);
            submitData.append("password", formData.password);
            submitData.append("phone", formData.phoneNumber);
            submitData.append("website", formData.website || "");
            submitData.append("mission", formData.missionStatement);
            submitData.append("interested_cats", formData.focusSectors);
            submitData.append("regions", formData.targetRegions);
            submitData.append("termsAgreed", formData.termsAgreed);
            submitData.append("investor", 2);

            if (formData.organizationDocuments) {
                formData.organizationDocuments.forEach((file, index) => {
                    //submitData.append(`document_${index}`, file);
                    submitData.append("document", file);
                });
            }

            console.log(
                "Form data to be submitted:",
                Object.fromEntries(submitData)
            );

            const { data } = await axiosClient.post("/register", submitData);
            console.log(data);

            if (data.error) {
                formErrors.push(data.error);
                showAlert("error", data.error);
                setErrors({ general: formErrors });
                return;
            }
            if (data.auth) {
                setUser(data.user);
                setToken(data.token);
                navigate("/grants-overview");
            }

            await new Promise((resolve) => setTimeout(resolve, 2000));

            showAlert("success", "Registration successful!");

        } catch (error) {
            console.error("Registration error:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Registration failed. Please try again.";
            showAlert("error", errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <Step1
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                        <SignInPrompt
                            handleBackToLogin={handleBackToLogin}
                            isSubmitting={isSubmitting}
                        />
                    </>
                );
            case 2:
                return (
                    <Step2
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleSectorChange={handleSectorChange}
                        handleRegionChange={handleRegionChange}
                    />
                );
            case 3:
                return (
                    <Step3
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleFileUpload={handleFileUpload}
                    />
                );
            case 4:
                return (
                    <RegistrationSummary
                        formData={formData}
                        onTermsChange={handleTermsChange}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-lg w-full max-w-2xl mx-auto">
            <div className="flex justify-center mb-4">
                <img src={logo} alt="Tujitume Logo" className="h-16" />
            </div>

            <h2 className="text-2xl font-bold mb-6 text-center text-green">
                Grant Provider Registration
            </h2>

            <StepperIndicator currentStep={currentStep} totalSteps={4} />

            <form onSubmit={handleSubmit} className="space-y-4">
                {renderStepContent()}

                <div className="flex justify-between items-center mt-6 gap-4">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="py-2 px-4 bg-gray-300 text-black font-semibold rounded-md hover:bg-gray-400"
                            disabled={isSubmitting}
                        >
                            Previous
                        </button>
                    )}

                    {currentStep < 4 ? (
                        <button
                            type="submit"
                            className="ml-auto py-2 px-4 bg-green text-white font-semibold rounded-md hover:bg-green-600"
                            disabled={isSubmitting}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="py-2 px-6 bg-green text-white font-semibold rounded-md hover:bg-green-600 flex items-center justify-center"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : (
                                "Complete Registration"
                            )}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default GrantProviderRegistration;
