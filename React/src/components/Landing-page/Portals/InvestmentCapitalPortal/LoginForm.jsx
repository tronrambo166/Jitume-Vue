import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAlert } from "../../../partials/AlertContext";
import ForgotPassModal from "../../../partials/ForgotPassModal";
import logo2 from "../../../../images/Tujitumelogo.svg";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../../axiosClient";

const LoginForm = ({ onSwitchToRegister }) => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassModal, setShowForgotPassModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [serverError, setServerError] = useState("");

    // Check for saved email on component mount
    useEffect(() => {
        const savedEmail = localStorage.getItem("savedEmail");
        const savedRememberMe = localStorage.getItem("rememberMe") === "true";

        if (savedEmail && savedRememberMe) {
            setLoginData((prev) => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (serverError) {
            setServerError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setServerError("");

        const { email, password } = loginData;

        // Basic validation
        if (!email.trim()) {
            setServerError("Please enter your email address");
            setIsLoading(false);
            return;
        }

        if (!password) {
            setServerError("Please enter your password");
            setIsLoading(false);
            return;
        }

        try {
            const payload = {
                email: email.trim(),
                password,
                browserLoginCheck: 1,
            };

            const { data } = await axiosClient.post("/login", payload);

            if (data.auth) {
                // Save the email if remember me is checked
                if (rememberMe) {
                    localStorage.setItem("savedEmail", email);
                    localStorage.setItem("rememberMe", "true");
                } else {
                    localStorage.removeItem("savedEmail");
                    localStorage.removeItem("rememberMe");
                }

                // Set auth data in local storage or context
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                // Show success message
                const userName =
                    data.user?.fname && data.user?.lname
                        ? `${data.user.fname} ${data.user.lname}`
                        : "User";
                showAlert("success", `Login successful! Welcome, ${userName}`);

                // Navigate to grants overview page
                navigate("/grants-overview");
            } else {
                setServerError(
                    data.message ||
                        "Login failed. Please check your credentials."
                );
                showAlert(
                    "error",
                    data.message ||
                        "Login failed. Please check your credentials."
                );
            }
        } catch (error) {
            console.error("Login error:", error);
            const errorMessage =
                error.response?.data?.message ||
                "Login failed. Please try again later.";
            setServerError(errorMessage);
            showAlert("error", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        showAlert(
            "error",
            "Failed to initialize Google login. Please try again."
        );
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
        showAlert("success", "Password reset instructions sent to your email!");
    };

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <div className="w-full max-w-md space-y-6">
                {/* Logo added here */}
                <div className="flex justify-center">
                    <img
                        src={logo2}
                        alt="Tujitume Logo"
                        className="h-16 " // Adjust height as needed
                    />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 text-center">
                    Welcome back
                </h2>

                {/* Server Error Message */}
                {serverError && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                        {serverError}
                    </div>
                )}

                <button
                    type="button"
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

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    id="login-form"
                    autoComplete="on"
                >
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={loginData.email}
                            onChange={handleInputChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            placeholder="Email address"
                            autoComplete="email"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={loginData.password}
                            onChange={handleInputChange}
                            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            placeholder="Password"
                            autoComplete="current-password"
                            disabled={isLoading}
                        />
                        {/* Password visibility toggle */}
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            tabIndex="-1"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember_me"
                                name="remember_me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={handleRememberMeChange}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                                disabled={isLoading}
                            />
                            <label
                                htmlFor="remember_me"
                                className="ml-2 block text-sm text-gray-900 cursor-pointer"
                            >
                                Remember me
                            </label>
                        </div>
                        <button
                            type="button"
                            onClick={handleForgotPasswordClick}
                            className="text-sm font-medium text-green-600 hover:text-green-500"
                            disabled={isLoading}
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
                        type="button"
                        onClick={onSwitchToRegister}
                        className="font-medium text-green-600 hover:text-green-500"
                        disabled={isLoading}
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
