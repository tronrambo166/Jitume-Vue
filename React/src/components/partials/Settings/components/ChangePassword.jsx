import React, { useState } from "react";
import { useAlert } from "../../../partials/AlertContext"; // Ensure correct path for AlertContext
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Eye icons for show/hide functionality

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { showAlert } = useAlert(); // Using showAlert from context

    const handleSubmit = (e) => {
        e.preventDefault();

        // Form validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            showAlert("error", "Please fill in all fields.");
            return;
        }

        // Check if new password and confirm password match
        if (newPassword !== confirmPassword) {
            showAlert(
                "error",
                "New password and confirmation password do not match."
            );
            return;
        }

        // Log form data on successful submission
        console.log("Form data:", {
            currentPassword,
            newPassword,
        });

        // Show success alert using showAlert from context
        showAlert("success", "Password changed successfully!");
    };

    return (
        <div className="p-8 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="current-password"
                        className="block text-sm font-medium"
                    >
                        Current Password
                    </label>
                    <div className="relative">
                        <input
                            id="current-password"
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="mt-1 block w-full bg-white border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-green focus:border-green"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute inset-y-0 right-2 flex items-center text-gray-600"
                        >
                            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="new-password"
                        className="block text-sm font-medium"
                    >
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full bg-white border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-green focus:border-green"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-2 flex items-center text-gray-600"
                        >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="confirm-password"
                        className="block text-sm font-medium"
                    >
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full bg-white border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-green focus:border-green"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute inset-y-0 right-2 flex items-center text-gray-600"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-4 px-6 py-2 bg-green rounded-lg text-white  btn-primary transition"
                >
                    Save
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
