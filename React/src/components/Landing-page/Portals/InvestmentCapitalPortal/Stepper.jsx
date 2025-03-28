import React from "react";

const Stepper = ({ currentStep, totalSteps }) => {
    const stepNames = {
        1: "Basic Info",
        2: "Password",
        3: "Preferences",
        4: "Engagement",
        5: "Summary",
    };

    return (
        <div className="w-full overflow-x-auto pb-2">
            <div className="flex items-start min-w-max">
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center min-w-[70px]">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
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
                                {/* Show full name on desktop, abbreviated on mobile */}
                                <span className="hidden sm:inline">
                                    {stepNames[index + 1] ||
                                        `Step ${index + 1}`}
                                </span>
                                <span className="sm:hidden">
                                    {stepNames[index + 1]?.split(" ")[0] ||
                                        index + 1}
                                </span>
                            </div>
                        </div>
                        {index < totalSteps - 1 && (
                            <div
                                className={`flex-1 h-1 mx-2 mt-3.5 min-w-[30px] ${
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
