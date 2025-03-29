import React, { useState } from "react";
import Stepper from "./Stepper";
import BasicInfoStep from "./steps/BasicInfoStep";
import PasswordStep from "./steps/PasswordStep";
import PreferencesStep from "./steps/PreferencesStep";
import EngagementStep from "./steps/EngagementStep";
import SummaryStep from "./steps/SummaryStep";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import logo from "../../../../images/Tujitumelogo.svg";
import { useAlert } from "../../../partials/AlertContext";

const InvestorRegisterForm = ({ onSwitchToLogin }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileUploadError, setFileUploadError] = useState("");
    const { showAlert } = useAlert();

    const [formData, setFormData] = useState({
        name: "",
        investorType: "",
        email: "",
        phone: "",
        website: "",
        password: "",
        confirmPassword: "",
        preferredSectors: [],
        startupStagePreferences: [],
        investmentRange: { min: 10, max: 10000 },
        geographicFocus: [],
        engagementTypes: [],
        investmentGuidelines: [],
        termsAgreed: false,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (files) => {
        setFileUploadError("");

        const currentFileCount = formData.investmentGuidelines.length;
        const newFileCount = files.length;

        if (currentFileCount + newFileCount > 5) {
            showAlert("error", "Maximum of 5 files allowed");
            return;
        }

        const validFiles = files.filter((file) => {
            const isValidType = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ].includes(file.type);

            const isValidSize = file.size <= 10 * 1024 * 1024;

            return isValidType && isValidSize;
        });

        const invalidFiles = files.filter(
            (file) =>
                ![
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ].includes(file.type) || file.size > 10 * 1024 * 1024
        );

        if (invalidFiles.length > 0) {
            showAlert(
                "error",
                "Only PDF and DOCX files up to 10MB are allowed"
            );
        }

        const updatedFiles = [...formData.investmentGuidelines, ...validFiles];
        setFormData((prev) => ({
            ...prev,
            investmentGuidelines: updatedFiles,
        }));
    };

    const removeFile = (fileToRemove) => {
        setFormData((prev) => ({
            ...prev,
            investmentGuidelines: prev.investmentGuidelines.filter(
                (file) => file !== fileToRemove
            ),
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

    const nextStep = (e) => {
        if (e) e.preventDefault();

        if (
            currentStep === 1 &&
            (!formData.name || !formData.investorType || !formData.email)
        ) {
            showAlert("error", "Please fill in all required fields");
            return;
        }

        if (
            currentStep === 2 &&
            (!formData.password ||
                formData.password !== formData.confirmPassword)
        ) {
            showAlert("error", "Passwords don't match");
            return;
        }

        setCurrentStep((prev) => Math.min(prev + 1, 5));
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

   const handleSubmit = async (e) => {
       e.preventDefault();

       if (!formData.termsAgreed) {
           showAlert("error", "Please agree to the terms and conditions");
           return;
       }

       setIsSubmitting(true);

       try {
           const submitData = new FormData();

           submitData.append("name", formData.name);
           submitData.append("investorType", formData.investorType);
           submitData.append("email", formData.email);
           submitData.append("phone", formData.phone);
           submitData.append("website", formData.website || "");
           submitData.append("password", formData.password);
           submitData.append("confirmPassword", formData.confirmPassword);
           submitData.append(
               "preferredSectors",
               formData.preferredSectors.join(",")
           );
           submitData.append(
               "startupStagePreferences",
               formData.startupStagePreferences.join(",")
           );
           submitData.append(
               "investmentRangeMin",
               formData.investmentRange.min
           );
           submitData.append(
               "investmentRangeMax",
               formData.investmentRange.max
           );
           submitData.append(
               "geographicFocus",
               formData.geographicFocus.join(",")
           );
           submitData.append(
               "engagementTypes",
               formData.engagementTypes.join(",")
           );
           submitData.append("termsAgreed", formData.termsAgreed);

           if (
               formData.investmentGuidelines &&
               formData.investmentGuidelines.length > 0
           ) {
               formData.investmentGuidelines.forEach((file) => {
                   submitData.append("investmentGuidelines", file);
               });
           }

           console.log("Submitting form data:", {
               ...Object.fromEntries(submitData),
               investmentGuidelines:
                   formData.investmentGuidelines?.map((f) => f.name) || [],
           });


           await new Promise((resolve) => setTimeout(resolve, 2000));

           showAlert("success", "Registration completed successfully!");

           console.log("Form submitted successfully!");
       } catch (error) {
           console.error("Submission error:", error);

           let errorMessage = "Registration failed. Please try again.";

           if (error.response) {
               errorMessage = error.response.data.message || errorMessage;
           } else if (error.request) {
               errorMessage =
                   "No response from server. Please check your connection.";
           }

           showAlert("error", errorMessage);
       } finally {
           setIsSubmitting(false);
       }
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
                        removeFile={removeFile}
                        fileUploadError={fileUploadError}
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
        <div className="w-full bg-white rounded-lg sm:max-w-2xl sm:mx-auto sm:p-4 ">
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

                    <div className="flex mt-6">
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
                            className="py-2 px-5 bg-green-600 text-white font-medium rounded-md shadow-md hover:bg-green-700 transition-all focus:ring-2 focus:ring-green-500 flex items-center justify-center disabled:opacity-50 ml-auto"
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
