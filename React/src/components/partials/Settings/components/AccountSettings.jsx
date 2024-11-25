import React, { useState } from "react";
import ChangePassword from "./ChangePassword";
import LogOutSessions from "./LogOutSessions";
import DeleteAccount from "./DeleteAccount";

const AccountSettings = () => {
    const [activeTab, setActiveTab] = useState("changePassword");

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Title Section */}
            <div className="bg-white sticky top-0 border-b z-10">
                <div className="px-4 py-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Account Settings
                    </h1>
                    <div className="bg-white px-6 py-4 rounded-lg ">
                        <div className="flex flex-wrap space-x-4 sm:space-x-6 md:space-x-10  pb-4">
                            {/* Change Password Tab */}
                            <div
                                className={`cursor-pointer py-2  px-4 rounded-t-lg transition-all duration-300 ease-in-out w-full sm:w-auto ${
                                    activeTab === "changePassword"
                                        ? "text-green-600 font-semibold border-b-2 border-green-600"
                                        : "text-gray-600 hover:text-green-600"
                                }`}
                                onClick={() => setActiveTab("changePassword")}
                            >
                                Change Password
                            </div>

                            {/* Log Out Sessions Tab */}
                            {/* <div
                                className={`cursor-pointer py-2 px-4 rounded-t-lg transition-all duration-300 ease-in-out w-full sm:w-auto ${
                                    activeTab === "logOutSessions"
                                        ? "text-green-600 font-semibold border-b-2 border-green-600"
                                        : "text-gray-600 hover:text-green-600"
                                }`}
                                onClick={() => setActiveTab("logOutSessions")}
                            >
                                Log Out Sessions
                            </div> */}

                            {/* Delete Account Tab */}
                            {/* <div
                                className={`cursor-pointer py-2 px-4 rounded-t-lg transition-all duration-300 ease-in-out w-full sm:w-auto ${
                                    activeTab === "deleteAccount"
                                        ? "text-green-600 font-semibold border-b-2 border-green-600"
                                        : "text-gray-600 hover:text-green-600"
                                }`}
                                onClick={() => setActiveTab("deleteAccount")}
                            >
                                Delete Account
                            </div> */}
                        </div>

                        {/* Tab Content */}
                        <div className="mt-6">
                            {activeTab === "changePassword" && (
                                <div className="bg-white p-6 rounded border">
                                    <ChangePassword />
                                </div>
                            )}
                            {/* {activeTab === "logOutSessions" && (
                                <div className="bg-white p-6 rounded border">
                                    <LogOutSessions />
                                </div>
                            )}
                            {activeTab === "deleteAccount" && (
                                <div className="bg-white p-6 rounded border">
                                    <DeleteAccount />
                                </div>
                            )} */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
