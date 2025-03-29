import React from "react";

<<<<<<< HEAD
const StepperIndicator = ({ currentStep }) => {
    const totalSteps = 6; // Since your form has 6 steps

    return (
        <div className="w-full mb-8">
            <div className="flex items-center">
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
=======
const StepperIndicator = ({ currentStep, totalSteps = 4 }) => {
    return (
        <div className="w-full mb-8 overflow-x-auto ">
            <div className="flex items-center min-w-max px-4 py-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center min-w-[80px]">
                            <div
                                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base ${
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
                                    index + 1 <= currentStep
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-200 text-gray-600"
                                }`}
                            >
                                {index + 1}
                            </div>
                            <div
<<<<<<< HEAD
                                className={`text-xs mt-1 ${
                                    index + 1 <= currentStep
                                        ? "text-green-600"
=======
                                className={`text-[10px] sm:text-xs mt-1 text-center ${
                                    index + 1 <= currentStep
                                        ? "text-green-600 font-medium"
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
                                        : "text-gray-500"
                                }`}
                            >
                                {getStepLabel(index + 1)}
                            </div>
                        </div>
                        {index < totalSteps - 1 && (
                            <div
<<<<<<< HEAD
                                className={`flex-1 h-1 mx-2 ${
=======
                                className={`flex-1 h-0.5 mx-1 sm:mx-2 min-w-[40px] ${
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
                                    index + 1 < currentStep
                                        ? "bg-green-600"
                                        : "bg-gray-200"
                                }`}
                            ></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

<<<<<<< HEAD
// Helper function to get step labels
const getStepLabel = (stepNumber) => {
    const labels = {
        1: "Organization",
        2: "Contact",
        3: "Account",
        4: "Focus Areas",
        5: "Terms",
        6: "Confirm",
=======
const getStepLabel = (stepNumber) => {
    const labels = {
        1: "Organization",
        2: "Security & Focus",
        3: "Mission",
        4: "Review & Terms",
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
    };
    return labels[stepNumber] || `Step ${stepNumber}`;
};

<<<<<<< HEAD
=======

>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
export default StepperIndicator;
