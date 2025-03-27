import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const GrantSeekerLogin = ({ onRegisterClick, showSignUp }) => {
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login Attempted:", loginData);
    };

    const handleGoogleLogin = () => {
        console.log("Continue with Google clicked");
    };

    if (showSignUp) return null;

    return (
        <div className="w-full max-w-md space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
                Welcome back
            </h2>

            {/* Google Login Button */}
            <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        />
                        <label
                            htmlFor="remember_me"
                            className="ml-2 block text-sm text-gray-900"
                        >
                            Remember me
                        </label>
                    </div>
                    <a
                        href="#"
                        className="text-sm font-medium text-green-600 hover:text-green-500"
                    >
                        Forgot password?
                    </a>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Sign in
                </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                    onClick={onRegisterClick}
                    className="font-medium text-green-600 hover:text-green-500"
                >
                    Sign up
                </button>
            </div>
        </div>
    );
};

export default GrantSeekerLogin;
