import React from "react";

const ChangePassword = () => (
    <div className=" p-8  rounded-lg  border">
        <h3 className="text-xl font-semibold mb-4">Change Password</h3>
        <div className="space-y-4">
            <div>
                <label
                    htmlFor="current-password"
                    className="block text-sm font-medium"
                >
                    Current Password
                </label>
                <input
                    id="current-password"
                    type="password"
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-green focus:border-green"
                />
            </div>
            <div>
                <label
                    htmlFor="new-password"
                    className="block text-sm font-medium"
                >
                    New Password
                </label>
                <input
                    id="new-password"
                    type="password"
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-green focus:border-green"
                />
            </div>
            <button className="mt-4 px-6 py-2 bg-green text-white rounded hover:bg-green">
                Save
            </button>
        </div>
    </div>
);

export default ChangePassword;
