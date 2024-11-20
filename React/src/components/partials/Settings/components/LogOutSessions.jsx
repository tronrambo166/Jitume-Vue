import React from "react";

const LogOutSessions = () => {
    return (
        <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">
                Log out other sessions
            </h3>
            <p className="text-gray-600 mb-4">
                Please enter your password to confirm you would like to log out
                of your other sessions across all of your devices.
            </p>
            <div className="space-y-4">
                <div>
                    <label
                        htmlFor="logout-password"
                        className="block text-sm font-medium text-gray-600"
                    >
                        Your password
                    </label>
                    <input
                        type="password"
                        id="logout-password"
                        className="mt-1 block w-full bg-white border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-green focus:border-green"
                    />
                </div>
                <button className="mt-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    Log out other sessions
                </button>
            </div>
        </div>
    );
};

export default LogOutSessions;
