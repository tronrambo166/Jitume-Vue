import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
<<<<<<< HEAD
import logo from "../../../../images/Tujitumelogo.svg"; // Adjust path as needed
=======
import { useAlert } from "../../../partials/AlertContext";
import ForgotPassModal from "../../../partials/ForgotPassModal";
import logo from "../../../../images/Tujitumelogo.svg";
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
import { useNavigate } from "react-router-dom";

const GrantSeekerLogin = ({ onRegisterClick, showSignUp }) => {
    const navigate = useNavigate();
<<<<<<< HEAD
=======
    const { showAlert } = useAlert();
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
<<<<<<< HEAD

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Field updated: ${name} = ${value}`); // Log field changes
=======
    const [showForgotPassModal, setShowForgotPassModal] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
        setLoginData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
<<<<<<< HEAD
        console.log("Login form data being submitted:", loginData); // Detailed form data log

        // Simulate API call
        setTimeout(() => {
            console.log("Login attempt completed for:", loginData.email); // Log completion
=======

        setTimeout(() => {
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
            setIsLoading(false);
        }, 1500);
    };

<<<<<<< HEAD
   const handleGoogleLogin = () => {
       console.log("Google login initiated");

       // Replace this with actual Google login logic
       // If login is successful, navigate to the grants page

       navigate("/grants-overview/grants-overview/grants-home");
   };
=======
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
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55

    if (showSignUp) return null;

    return (
<<<<<<< HEAD
        <div className="w-full max-w-md space-y-6">
            {/* Logo Section */}
            <div className="flex justify-center">
                <img
                    src={logo}
                    alt="Tujitume Logo"
                    className="h-16 mb-4" // Adjust size as needed
                />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center">
=======
        <div className="w-full max-w-sm mx-auto p-6 bg-white rounded-lg">
            {/* Logo Section */}
            <div className="flex justify-center">
                <img src={logo} alt="Tujitume Logo" className="h-14 mb-4" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
                Welcome back
            </h2>

            {/* Google Login Button */}
            <button
                onClick={handleGoogleLogin}
<<<<<<< HEAD
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
=======
                className="w-full flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-100 focus:ring-2 focus:ring-green-500"
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
                disabled={isLoading}
            >
                <FcGoogle className="h-5 w-5" />
                Continue with Google
            </button>

            {/* Divider */}
<<<<<<< HEAD
            <div className="relative">
=======
            <div className="relative my-4">
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                    <span className="px-2 bg-white text-sm text-gray-500">
                        or continue with email
                    </span>
                </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div className="relative">
<<<<<<< HEAD
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                    </div>
=======
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
                    <input
                        name="email"
                        type="email"
                        required
                        value={loginData.email}
                        onChange={handleInputChange}
<<<<<<< HEAD
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Email address"
                        disabled={isLoading}
                    />
=======
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                        placeholder="Email address"
                        disabled={isLoading}
                    />
                    <Mail className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
                </div>

                {/* Password Input */}
                <div className="relative">
<<<<<<< HEAD
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                    </div>
=======
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
                    <input
                        name="password"
                        type="password"
                        required
                        value={loginData.password}
                        onChange={handleInputChange}
<<<<<<< HEAD
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Password"
                        disabled={isLoading}
                    />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember_me"
                            name="remember_me"
=======
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                        placeholder="Password"
                        disabled={isLoading}
                    />
                    <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2">
                        <input
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
                            type="checkbox"
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            disabled={isLoading}
                        />
<<<<<<< HEAD
                        <label
                            htmlFor="remember_me"
                            className="ml-2 block text-sm text-gray-900"
                        >
                            Remember me
                        </label>
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            console.log(
                                "Forgot password clicked for:",
                                loginData.email
                            );
                            // Add forgot password logic here
                        }}
                        className="text-sm font-medium text-green-600 hover:text-green-500"
=======
                        <span className="text-gray-900">Remember me</span>
                    </label>
                    <button
                        onClick={handleForgotPasswordClick}
                        className="text-green-600 hover:text-green-500"
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
                        disabled={isLoading}
                    >
                        Forgot password?
                    </button>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
<<<<<<< HEAD
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
=======
                    className="w-full py-3 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex justify-center items-center"
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
<<<<<<< HEAD
                            <AiOutlineLoading3Quarters className="animate-spin h-4 w-4 mr-2" />
=======
                            <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 mr-2" />
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
                            Signing in...
                        </>
                    ) : (
                        "Sign in"
                    )}
                </button>
            </form>

            {/* Sign Up Link */}
<<<<<<< HEAD
            <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                    onClick={() => {
                        console.log("Navigate to registration");
                        onRegisterClick();
                    }}
=======
            <div className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{" "}
                <button
                    onClick={onRegisterClick}
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
                    className="font-medium text-green-600 hover:text-green-500"
                    disabled={isLoading}
                >
                    Sign up
                </button>
            </div>
<<<<<<< HEAD
=======

            {/* Forgot Password Modal */}
            {showForgotPassModal && (
                <ForgotPassModal
                    isOpen={showForgotPassModal}
                    onClose={handleCloseForgotPassModal}
                    onSuccess={handlePasswordResetSuccess}
                    initialEmail={loginData.email}
                />
            )}
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
        </div>
    );
};

export default GrantSeekerLogin;
