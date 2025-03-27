import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import logo from "../../../../images/Tujitumelogo.svg"; // Adjust path as needed

const GrantSeekerLogin = ({ onRegisterClick, showSignUp }) => {
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Field updated: ${name} = ${value}`); // Log field changes
        setLoginData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log("Login form data being submitted:", loginData); // Detailed form data log

        // Simulate API call
        setTimeout(() => {
            console.log("Login attempt completed for:", loginData.email); // Log completion
            setIsLoading(false);
        }, 1500);
    };

    const handleGoogleLogin = () => {
        console.log("Google login initiated");
        // Add actual Google login implementation here
    };

    if (showSignUp) return null;

    return (
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
                Welcome back
            </h2>

            {/* Google Login Button */}
            <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
            >
                <FcGoogle className="h-5 w-5" />
                Continue with Google
            </button>

            {/* Divider */}
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

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
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
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Email address"
                        disabled={isLoading}
                    />
                </div>

                {/* Password Input */}
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
                            type="checkbox"
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            disabled={isLoading}
                        />
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
                        disabled={isLoading}
                    >
                        Forgot password?
                    </button>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    disabled={isLoading}
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

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                    onClick={() => {
                        console.log("Navigate to registration");
                        onRegisterClick();
                    }}
                    className="font-medium text-green-600 hover:text-green-500"
                    disabled={isLoading}
                >
                    Sign up
                </button>
            </div>
        </div>
    );
};

export default GrantSeekerLogin;
