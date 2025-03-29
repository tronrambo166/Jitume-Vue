import React from "react";

const StepperIndicator = ({ currentStep, totalSteps = 4 }) => {
    return (
        <div className="w-full mb-8 overflow-x-auto ">
            <div className="flex items-center min-w-max px-4 py-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center min-w-[80px]">
                            <div
                                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base ${
                                    index + 1 <= currentStep
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-200 text-gray-600"
                                }`}
                            >
                                {index + 1}
                            </div>
                            <div
                                className={`text-[10px] sm:text-xs mt-1 text-center ${
                                    index + 1 <= currentStep
                                        ? "text-green-600 font-medium"
                                        : "text-gray-500"
                                }`}
                            >
                                {getStepLabel(index + 1)}
                            </div>
                        </div>
                        {index < totalSteps - 1 && (
                            <div
                                className={`flex-1 h-0.5 mx-1 sm:mx-2 min-w-[40px] ${
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

const getStepLabel = (stepNumber) => {
    const labels = {
        1: "Organization",
        2: "Security & Focus",
        3: "Mission",
        4: "Review & Terms",
    };
    return labels[stepNumber] || `Step ${stepNumber}`;
};

export default StepperIndicator;
