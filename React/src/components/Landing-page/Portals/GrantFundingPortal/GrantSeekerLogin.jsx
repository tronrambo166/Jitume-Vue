import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import logo from "../../../../images/Tujitumelogo.svg"; // Adjust path as needed
import { useNavigate } from "react-router-dom";

const GrantSeekerLogin = ({ onRegisterClick, showSignUp }) => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    };

    const handleGoogleLogin = () => {
        navigate("/grants-overview");
    };

    if (showSignUp) return null;

    return (
        <div className="w-full max-w-sm mx-auto p-6 bg-white  rounded-lg">
            {/* Logo Section */}
            <div className="flex justify-center">
                <img src={logo} alt="Tujitume Logo" className="h-14 mb-4" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
                Welcome back
            </h2>

            {/* Google Login Button */}
            <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-100 focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
            >
                <FcGoogle className="h-5 w-5" />
                Continue with Google
            </button>

            {/* Divider */}
            <div className="relative my-4">
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
                    <input
                        name="email"
                        type="email"
                        required
                        value={loginData.email}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                        placeholder="Email address"
                        disabled={isLoading}
                    />
                    <Mail className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                </div>

                {/* Password Input */}
                <div className="relative">
                    <input
                        name="password"
                        type="password"
                        required
                        value={loginData.password}
                        onChange={handleInputChange}
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
                            type="checkbox"
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            disabled={isLoading}
                        />
                        <span className="text-gray-900">Remember me</span>
                    </label>
                    <button
                        onClick={(e) => e.preventDefault()}
                        className="text-green-600 hover:text-green-500"
                        disabled={isLoading}
                    >
                        Forgot password?
                    </button>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-3 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex justify-center items-center"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 mr-2" />
                            Signing in...
                        </>
                    ) : (
                        "Sign in"
                    )}
                </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{" "}
                <button
                    onClick={onRegisterClick}
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
