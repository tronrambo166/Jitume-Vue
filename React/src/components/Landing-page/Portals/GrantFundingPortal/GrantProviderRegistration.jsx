import React, { useState } from "react";
import { useAlert } from "../../../partials/AlertContext";
<<<<<<< HEAD
import FormInput from "./components/FormInput";
import FormSelect from "./components/FormSelect";
import CheckboxGroup from "./components/CheckboxGroup";
import FormTextarea from "./components/FormTextarea";
import TermsCheckbox from "./components/TermsCheckbox";
import StepperIndicator from "./components/StepperIndicator";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import logo from "../../../../images/Tujitumelogo.svg"; // Adjust path as needed
import {
    ORGANIZATION_TYPES,
    FOCUS_SECTOR_OPTIONS,
    TARGET_REGION_OPTIONS,
    INITIAL_FORM_DATA,
} from "./registrationOptions";
=======
import StepperIndicator from "./components/StepperIndicator";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import logo from "../../../../images/Tujitumelogo.svg";
import { INITIAL_FORM_DATA } from "./registrationOptions";
import Step1 from "./components/steps/Step1";
import Step2 from "./components/steps/Step2";
import Step3 from "./components/steps/Step3";
import RegistrationSummary from "./components/RegistrationSummary";

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
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55

const GrantProviderRegistration = ({ handleBackToLogin }) => {
    const { showAlert } = useAlert();
    const [currentStep, setCurrentStep] = useState(1);
<<<<<<< HEAD
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
=======
    const [formData, setFormData] = useState({
        ...INITIAL_FORM_DATA,
        website: "", // Add website field to initial state
    });
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
<<<<<<< HEAD
        console.log(`Field updated: ${name} = ${value}`);
        setFormData((prev) => ({
            ...prev,
            [name]: value,
=======
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (files) => {
        setFormData((prev) => ({
            ...prev,
            organizationDocuments: files,
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
        }));
    };

    const handleSectorChange = (sector) => {
<<<<<<< HEAD
        console.log(`Sector changed: ${sector}`);
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
        console.log(`Region changed: ${region}`);
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
=======
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
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
    };

    const validateStep = () => {
        switch (currentStep) {
            case 1:
<<<<<<< HEAD
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
=======
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
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
            default:
                return false;
        }
    };

    const nextStep = () => {
        if (validateStep()) {
<<<<<<< HEAD
            console.log(`Moving to step ${currentStep + 1}`);
            setCurrentStep((prev) => Math.min(prev + 1, 6));
        } else {
            console.warn("Validation failed for current step");
=======
            setCurrentStep((prev) => Math.min(prev + 1, 4));
        } else {
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
            showAlert("error", "Please fill in all required fields correctly.");
        }
    };

    const prevStep = () => {
<<<<<<< HEAD
        console.log(`Moving back to step ${currentStep - 1}`);
=======
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
<<<<<<< HEAD

 

        setIsSubmitting(true);
        console.log("Form submission started", formData);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log("Form submitted successfully", formData);
            showAlert("success", "Registration successful!");
        } catch (error) {
            console.error("Submission error:", error);
=======
        if (currentStep < 4) {
            nextStep();
            return;
        }

        if (!formData.termsAgreed) {
            showAlert("error", "You must agree to the terms and conditions");
            return;
        }

        // Prepare the data to be sent to backend
        const submissionData = {
            organizationName: formData.organizationName,
            organizationType: formData.organizationType,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            website: formData.website, // Include website in submission
            missionStatement: formData.missionStatement,
            focusSectors: formData.focusSectors,
            targetRegions: formData.targetRegions,
            organizationDocuments: formData.organizationDocuments?.map(
                (file) => ({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                })
            ),
        };

        setIsSubmitting(true);
        try {
            // Simulate form submission
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log("Form data to be submitted:", submissionData);
            showAlert("success", "Registration successful!");
        } catch (error) {
            console.error("Registration error:", error);
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
            showAlert("error", "Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
<<<<<<< HEAD
        console.log(`Rendering step ${currentStep} content`);
=======
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
        switch (currentStep) {
            case 1:
                return (
                    <>
<<<<<<< HEAD
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
=======
                        <Step1
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                        <SignInPrompt
                            handleBackToLogin={handleBackToLogin}
                            isSubmitting={isSubmitting}
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
                        />
                    </>
                );
            case 2:
                return (
<<<<<<< HEAD
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
=======
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
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
                );
            default:
                return null;
        }
    };

    return (
<<<<<<< HEAD
        <div className="p-6 bg-white rounded-lg max-w-2xl mx-auto">
            {/* Logo Section */}
=======
        <div className="bg-white rounded-lg w-full max-w-2xl mx-auto">
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
            <div className="flex justify-center mb-4">
                <img src={logo} alt="Tujitume Logo" className="h-16" />
            </div>

            <h2 className="text-2xl font-bold mb-6 text-center text-green">
                Grant Provider Registration
            </h2>

<<<<<<< HEAD
            {/* "Already have an account" link */}

            <StepperIndicator currentStep={currentStep} />
=======
            <StepperIndicator currentStep={currentStep} totalSteps={4} />
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55

            <form onSubmit={handleSubmit} className="space-y-4">
                {renderStepContent()}

<<<<<<< HEAD
                <div className="flex justify-between mt-6">
                    {currentStep > 1 && currentStep < 6 && (
=======
                <div className="flex justify-between items-center mt-6 gap-4">
                    {currentStep > 1 && (
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
                        <button
                            type="button"
                            onClick={prevStep}
                            className="py-2 px-4 bg-gray-300 text-black font-semibold rounded-md hover:bg-gray-400"
                            disabled={isSubmitting}
                        >
                            Previous
                        </button>
                    )}

<<<<<<< HEAD
                    {currentStep < 6 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="ml-auto py-2 px-4 bg-green text-white font-semibold rounded-md hover:bg-green-600"
                            disabled={isSubmitting}
                        >
                            {currentStep === 5 ? "Review" : "Next"}
=======
                    {currentStep < 4 ? (
                        <button
                            type="submit"
                            className="ml-auto py-2 px-4 bg-green text-white font-semibold rounded-md hover:bg-green-600"
                            disabled={isSubmitting}
                        >
                            Next
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
                        </button>
                    ) : (
                        <button
                            type="submit"
<<<<<<< HEAD
                            className="w-full py-2 px-4 bg-green text-white font-semibold rounded-md hover:bg-green-600 flex items-center justify-center"
=======
                            className="py-2 px-6 bg-green text-white font-semibold rounded-md hover:bg-green-600 flex items-center justify-center"
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
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
<<<<<<< HEAD
            <div className="text-center mb-6">
                <p className="text-gray-600">
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
=======
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
        </div>
    );
};

export default GrantProviderRegistration;
