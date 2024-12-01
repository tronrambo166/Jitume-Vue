import React, { useState } from "react";
import { useAlert } from "../partials/AlertContext";
import axiosClient from "../../axiosClient";

const ForgotPassModal = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordC, setPasswordC] = useState("");
    const [oldCode, setOldCode] = useState(null);
    const [code, setCode] = useState("");
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handlePasswordCChange = (e) => {
        setPasswordC(e.target.value);
    };

    const handleCodeChange = (e) => {
        setCode(e.target.value);
    };

    const handleEmailSubmit = async () => {
        if (email.trim()) {
        const newcode = Math.floor(Math.random() * 10000);
        // Send email verification
        const verify = await emailVerify(newcode);
        setIsLoading(true);
        //Set a loading here
        if (verify) {
            showAlert(
                "info",
                "Verification email sent successfully. Please check your inbox."
            );
            }
        } else {
            showAlert("error", "Please enter a valid email address.");
        }
    };

    const handleResetSubmit = async () => {
        if (oldCode == code) {
            if(password == passwordC){
                const { data } = await axiosClient.get(
                `resetPassword/${email}/${password}`
                );
                setIsLoading(true);
                if (data.status === 200) {
                    showAlert("success", data.message);
                } else {
                    showAlert("error", data.message || "Email not sent.");
                }
            }
            else
            showAlert("error", "Password do not match");
            //onClose(); // Close modal after submission
        } else {console.log(oldCode)
            showAlert("error", "Wrong Code");
        }
    };

    //MAIL VERIFY
    const emailVerify = async (code) => {
        try {
            // Make the API request to verify OTP
            const { data } = await axiosClient.get(
                `emailVerify/${email}/${code}`
            );
            setIsLoading(true);
            if (data.status === 200) {
                setOldCode(code);
                return true;
            } else {
                showAlert("error", data.message || "Email not sent.");
                return false; // OTP verification failed
            }
        } catch (error) {
            console.error("Error during email verification:", error);
            showAlert(
                "error",
                error.response?.data?.message || "An error occurred."
            );
            return false; // OTP verification failed
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

            {/*Reset Form Div*/} <br></br>
            <div
                className="bg-white p-6 rounded shadow-lg w-[400px]"
                onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
            >
                <h2 className="text-lg font-bold text-gray-600 mb-4">
                    Reset Password
                </h2>
                <p className="mb-4 text-gray-600">
                    Please enter verification code sent to your email.
                </p>
                <input
                    type="text"
                    placeholder="Code"
                    className="w-full p-2 mb-4 border rounded text-gray-600"
                    value={code}
                    onChange={handleCodeChange}
                />

                <input
                    type="password"
                    placeholder="New password"
                    className="w-full p-2 mb-4 border rounded text-gray-600"
                    value={password}
                    onChange={handlePasswordChange}
                />

                <input
                    type="password"
                    placeholder="Confirm password"
                    className="w-full p-2 mb-4 border rounded text-gray-600"
                    value={passwordC}
                    onChange={handlePasswordCChange}
                />

                <div className="flex justify-between">
                    <button
                        onClick={onClose}
                        className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleResetSubmit}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Submit
                    </button>
                </div>
            </div>
            {/*Reset Form Div*/}
        </div>
    );
};

export default ForgotPassModal;
