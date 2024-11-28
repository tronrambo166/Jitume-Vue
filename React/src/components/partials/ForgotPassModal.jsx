import React, { useState } from "react";
import { useAlert } from "../partials/AlertContext";

const ForgotPassModal = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const { showAlert } = useAlert();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleEmailSubmit = () => {
        if (email.trim()) {
            console.log("Email submitted:", email);
            showAlert("success", "Password reset link sent to your email!");
            onClose(); // Close modal after submission
        } else {
            showAlert("error", "Please enter a valid email address.");
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={onClose} // Close modal when clicking outside
        >
            <div
                className="bg-white p-6 rounded shadow-lg w-[400px]"
                onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
            >
                <h2 className="text-lg font-bold text-gray-600 mb-4">
                    Reset Password
                </h2>
                <p className="mb-4 text-gray-600">
                    Please enter your email to reset your password.
                </p>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 mb-4 border rounded text-gray-600"
                    value={email}
                    onChange={handleEmailChange}
                />

                <div className="flex justify-between">
                    <button
                        onClick={onClose}
                        className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleEmailSubmit}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassModal;
