import React, { useState } from "react";
import PersonalInfo from "./components/PersonalInfo";
import AccountSettings from "./components/AccountSettings";

const Settings = () => {
    const [activeTab, setActiveTab] = useState("personal");

    return (
        <div className="min-h-screen mt-8 sm:mt-4 md:mt-8 lg:mt-10 xl:mt-12">
            {/* Title Section */}
            <div className="bg-white sticky top-0 border-b z-10">
                <div className="px-4 py-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Settings
                    </h1>
                    <div className="bg-white px-6 py-4 rounded-lg shadow-sm">
                        <div className="flex space-x-10 border-b-2 pb-4">
                            {/* Personal Info Tab */}
                            <div
                                className={`cursor-pointer py-2 px-4 rounded-t-lg transition-all duration-300 ease-in-out ${
                                    activeTab === "personal"
                                        ? "text-green-600 font-semibold border-b-2 border-green-600"
                                        : "text-gray-600 hover:text-green-600"
                                }`}
                                onClick={() => setActiveTab("personal")}
                            >
                                Personal Info
                            </div>

                            {/* Account Settings Tab */}
                            <div
                                className={`cursor-pointer py-2 px-4 rounded-t-lg transition-all duration-300 ease-in-out ${
                                    activeTab === "account"
                                        ? "text-green-600 font-semibold border-b-2 border-green-600"
                                        : "text-gray-600 hover:text-green-600"
                                }`}
                                onClick={() => setActiveTab("account")}
                            >
                                Account Settings
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="mt-6">
                            {activeTab === "personal" && (
                                <div className="bg-white p-6 rounded-lg border shadow-sm">
                                    <PersonalInfo />
                                </div>
                            )}
                            {activeTab === "account" && (
                                <div className="bg-white p-6 rounded-lg border shadow-sm">
                                    <AccountSettings />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Content for Larger Screens */}
            <div className="p-4 sm:p-6 lg:p-8">
                {activeTab === "personal" && (
                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                       
                    </div>
                )}
                {activeTab === "account" && (
                    <div className="bg-white p-6 rounded-lg border shadow-sm"></div>
                )}
            </div>
        </div>
    );
};

export default Settings;
