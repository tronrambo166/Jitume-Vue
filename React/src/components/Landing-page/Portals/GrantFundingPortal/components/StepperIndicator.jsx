import React from "react";

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
                                    index + 1 <= currentStep
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-200 text-gray-600"
                                }`}
                            >
                                {index + 1}
                            </div>
                            <div
                                className={`text-xs mt-1 ${
                                    index + 1 <= currentStep
                                        ? "text-green-600"
                                        : "text-gray-500"
                                }`}
                            >
                                {getStepLabel(index + 1)}
                            </div>
                        </div>
                        {index < totalSteps - 1 && (
                            <div
                                className={`flex-1 h-1 mx-2 ${
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

// Helper function to get step labels
const getStepLabel = (stepNumber) => {
    const labels = {
        1: "Organization",
        2: "Contact",
        3: "Account",
        4: "Focus Areas",
        5: "Terms",
        6: "Confirm",
    };
    return labels[stepNumber] || `Step ${stepNumber}`;
};

export default StepperIndicator;
