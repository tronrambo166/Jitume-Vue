import React, { useState } from "react";
import { useAlert } from "../partials/AlertContext";
import axiosClient from "../../axiosClient";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ForgotPassModal = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordC, setPasswordC] = useState("");
    const [code, setCode] = useState("");
    const [oldCode, setOldCode] = useState(null);
    const [showResetModal, setShowResetModal] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
        useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { showAlert } = useAlert();

    const toggleNewPasswordVisibility = () =>
        setIsNewPasswordVisible(!isNewPasswordVisible);
    const toggleConfirmPasswordVisibility = () =>
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

    const handleEmailSubmit = async () => {
        if (email.trim()) {
            try {
                setIsLoading(true);

                // Check if the email exists
                const { data } = await axiosClient.get(
                    "emailExists/" + email
                );
                if (data.status === 200) {
                    setIsLoading(false);
                    return showAlert(
                        "error",
                        "Email does not exist. Please use a registered email."
                    );
                }

                // Generate verification code
                const newCode = Math.floor(1000 + Math.random() * 9000); // Ensures 4-digit code
                const verify = await emailVerify(newCode);

                setIsLoading(false);
                if (verify) {
                    showAlert(
                        "info",
                        "Verification email sent successfully. Please check your inbox and enter the code below."
                    );
                    setShowResetModal(true);
                } else {
                    showAlert(
                        "error",
                        "Failed to send verification email. Please try again."
                    );
                }
            } catch (error) {
                setIsLoading(false);
                showAlert("error", "An error occurred. Please try again.");
                console.error("Error checking email existence:", error);
            }
        } else {
            showAlert("error", "Please enter a valid email address.");
        }
    };


    // const handleResetSubmit = async () => {
    //     if (oldCode == code) {
    //         if (password === passwordC) {
    //             setIsLoading(true);
    //             const { data } = await axiosClient.get(
    //                 `resetPassword/${email}/${password}`
    //             );
    //             setIsLoading(false);
    //             if (data.status === 200) {
    //                 showAlert(
    //                     "success",
    //                     "Password reset successful! You can now log in with your new password."
    //                 );
    //                 onClose();
    //             } else {
    //                 showAlert(
    //                     "error",
    //                     data.message || "Password reset failed."
    //                 );
    //             }
    //         } else {
    //             showAlert("error", "Passwords do not match. Please try again.");
    //         }
    //     } else {
    //         showAlert(
    //             "error",
    //             "Invalid code. Please check your email and enter the correct code."
    //         );
    //     }
    // };
const handleResetSubmit = async () => {
    if (!code || !password || !passwordC) {
        showAlert("error", "All fields are required.");
        return;
    }

    if (oldCode !== code) {
        showAlert(
            "error",
            "Invalid code. Please check your email and enter the correct code."
        );
        return;
    }

    if (password !== passwordC) {
        showAlert("error", "Passwords do not match. Please try again.");
        return;
    }

    // Password validation rules
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
        showAlert(
            "error",
            "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
        );
        return;
    }

    try {
        setIsLoading(true);
        const { data } = await axiosClient.get(
            `resetPassword/${email}/${password}`
        );
        setIsLoading(false);

        if (data.status === 200) {
            showAlert(
                "success",
                "Password reset successful! You can now log in with your new password."
            );
            onClose();
        } else {
            showAlert("error", data.message || "Password reset failed.");
        }
    } catch (error) {
        setIsLoading(false);
        showAlert("error", "An error occurred. Please try again later.");
    }
};

    const emailVerify = async (code) => {
        try {
            const { data } = await axiosClient.get(
                `emailVerify/${email}/${code}`
            );
            if (data.status === 200) {
                setOldCode(code);
                return true;
            } else {
                showAlert(
                    "error",
                    data.message ||
                        "Failed to send verification email. Try again later."
                );
                return false;
            }
        } catch (error) {
            showAlert(
                "error",
                "An error occurred while verifying your email. Please try again."
            );
            return false;
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={onClose}
        >
            <div
                className="relative bg-white p-6 rounded shadow-lg w-[400px]"
                onClick={(e) => e.stopPropagation()}
            >
                <FaTimes
                    className="absolute top-3 right-3 text-gray-500 cursor-pointer hover:text-red-600"
                    onClick={onClose}
                    size={24}
                />
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <AiOutlineLoading3Quarters className="animate-spin text-3xl text-green-500" />
                        <p className="ml-3 text-gray-600">
                            Processing your request. Please wait...
                        </p>
                    </div>
                ) : (
                    <>
                        {!showResetModal ? (
                            <>
                                <h2 className="text-lg font-bold text-gray-600 mb-4">
                                    Reset Password
                                </h2>
                                <p className="mb-4 text-gray-600">
                                    Enter your email address below, and we'll
                                    send you a verification code to reset your
                                    password.
                                </p>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full p-2 mb-4 border rounded text-gray-600"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    onClick={handleEmailSubmit}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
                                >
                                    Send Verification Code
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-lg font-bold text-gray-600 mb-4">
                                    Enter Verification Code
                                </h2>
                                <p className="mb-4 text-gray-600">
                                    We sent a code to{" "}
                                    <strong className="font-bold text-green">
                                        {email}
                                    </strong>
                                    . Please enter the code below to reset your
                                    password.
                                </p>
                                <input
                                    type="text"
                                    placeholder="Verification Code"
                                    className="w-full p-2 mb-4 border rounded text-gray-600"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                                <div className="relative">
                                    <input
                                        type={
                                            isNewPasswordVisible
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="New Password"
                                        className="w-full p-2 mb-4 border rounded text-gray-600"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                    <span
                                        className="absolute right-3 top-3 cursor-pointer text-gray-600"
                                        onClick={toggleNewPasswordVisibility}
                                    >
                                        {isNewPasswordVisible ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}
                                    </span>
                                </div>
                                <div className="relative">
                                    <input
                                        type={
                                            isConfirmPasswordVisible
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm New Password"
                                        className="w-full p-2 mb-4 border rounded text-gray-600"
                                        value={passwordC}
                                        onChange={(e) =>
                                            setPasswordC(e.target.value)
                                        }
                                    />
                                    <span
                                        className="absolute right-3 top-3 cursor-pointer text-gray-600"
                                        onClick={
                                            toggleConfirmPasswordVisibility
                                        }
                                    >
                                        {isConfirmPasswordVisible ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}
                                    </span>
                                </div>
                                <button
                                    onClick={handleResetSubmit}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
                                >
                                    Reset Password
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassModal;
