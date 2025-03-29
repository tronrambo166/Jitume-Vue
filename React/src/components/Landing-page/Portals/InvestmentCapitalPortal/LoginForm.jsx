import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAlert } from "../../../partials/AlertContext";
import ForgotPassModal from "../../../partials/ForgotPassModal";
import logo2 from "../../../../images/Tujitumelogo.svg";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onSwitchToRegister }) => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassModal, setShowForgotPassModal] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log("Form Data:", loginData);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    };

    const handleGoogleLogin = () => {
         navigate("/grants-overview");
    };

    const handleForgotPasswordClick = (e) => {
        e.preventDefault();
        setShowForgotPassModal(true);
    };

    const handleCloseForgotPassModal = () => {
        setShowForgotPassModal(false);
    };

    const handlePasswordResetSuccess = () => {
        setShowForgotPassModal(false);
        showAlert(
            "success",
            "Password reset successful! You can now log in with your new password."
        );
    };

    return (
        <>
            <div className="w-full max-w-md space-y-6">
                {/* Logo added here */}
                <div className="flex justify-center">
                    <img
                        src={logo2}
                        alt="Tujitume Logo"
                        className="h-16 mb-4" // Adjust height as needed
                    />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 text-center">
                    Welcome back
                </h2>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <FcGoogle className="h-5 w-5" />
                    Continue with Google
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-2 bg-white text-sm text-gray-500">
                            or continue with email
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            name="email"
                            type="email"
                            required
                            value={loginData.email}
                            onChange={handleInputChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            placeholder="Email address"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            name="password"
                            type="password"
                            required
                            value={loginData.password}
                            onChange={handleInputChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            placeholder="Password"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember_me"
                                name="remember_me"
                                type="checkbox"
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="remember_me"
                                className="ml-2 block text-sm text-gray-900"
                            >
                                Remember me
                            </label>
                        </div>
                        <button
                            onClick={handleForgotPasswordClick}
                            className="text-sm font-medium text-green-600 hover:text-green-500"
                        >
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70"
                    >
                        {isLoading ? (
                            <>
                                <AiOutlineLoading3Quarters className="animate-spin h-4 w-4 mr-2" />
                                Signing in...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                        onClick={onSwitchToRegister}
                        className="font-medium text-green-600 hover:text-green-500"
                    >
                        Sign up
                    </button>
                </div>
            </div>

            {showForgotPassModal && (
                <ForgotPassModal
                    isOpen={showForgotPassModal}
                    onClose={handleCloseForgotPassModal}
                    onSuccess={handlePasswordResetSuccess}
                    initialEmail={loginData.email}
                />
            )}
        </>
    );
};

export default LoginForm;
