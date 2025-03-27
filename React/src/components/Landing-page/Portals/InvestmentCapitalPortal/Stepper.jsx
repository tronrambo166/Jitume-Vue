import React from "react";

const Stepper = ({ currentStep, totalSteps }) => {
    // Define step names corresponding to your imported components
    const stepNames = {
        1: "Basic Info",
        2: "Password",
        3: "Preferences",
        4: "Engagement",
        5: "Summary",
    };

    return (
        <div className="w-full">
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
                                className={`text-xs mt-1 text-center ${
                                    index + 1 <= currentStep
                                        ? "text-green-600 font-medium"
                                        : "text-gray-500"
                                }`}
                            >
                                {stepNames[index + 1] || `Step ${index + 1}`}
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

export default Stepper;
