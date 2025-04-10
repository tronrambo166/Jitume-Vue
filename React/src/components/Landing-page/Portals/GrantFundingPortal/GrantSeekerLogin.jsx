import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAlert } from "../../../partials/AlertContext";
import ForgotPassModal from "../../../partials/ForgotPassModal";
import logo from "../../../../images/Tujitumelogo.svg";
import { useNavigate, useLocation } from "react-router-dom";
import axiosClient from "../../../../axiosClient";
import { useStateContext } from "../../../../contexts/contextProvider";

const GrantSeekerLogin = ({ onRegisterClick, showSignUp }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { showAlert } = useAlert();
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [serverError, setServerError] = useState("");
    const [showForgotPassModal, setShowForgotPassModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { setUser, setToken } = useStateContext();

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
            // For Chrome password manager compatibility
            // Use form data in the expected format
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
                //localStorage.setItem("token", data.token);
                //localStorage.setItem("user", JSON.stringify(data.user));

                // Show success message
                const userName =
                    data.user?.fname && data.user?.lname
                        ? `${data.user.fname} ${data.user.lname}`
                        : "User";
                showAlert("success", `Login successful! Welcome, ${userName}`);

                setUser(data.user);
                setToken(data.token);
                // Navigate to grants overview page
                if (data.user.investor === 2) {
                    navigate("/grants-overview", {
                        // state: {
                        //     user: data.user,
                           
                        // },
                    });
                } else navigate("/dashboard");

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
            console.log("dara",data)
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

    if (showSignUp) return null;

    return (
        <div className="w-full max-w-md mx-auto  bg-white rounded-lg">
            {/* Logo Section */}
            <div className="flex justify-center">
                <img src={logo} alt="Tujitume Logo" className="h-14 mb-4" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
                Welcome back
            </h2>

            {/* Server Error Message */}
            {serverError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {serverError}
                </div>
            )}

            {/* Google Login Button */}
            <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-100 focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
                type="button"
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
            <form
                onSubmit={handleSubmit}
                className="space-y-4"
                id="login-form"
                autoComplete="on"
            >
                {/* Email Input */}
                <div className="relative">
                    <input
                        name="email"
                        type="email"
                        id="email"
                        required
                        value={loginData.email}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                        placeholder="Email address"
                        disabled={isLoading}
                        autoComplete="email"
                    />
                    <Mail className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                </div>

                {/* Password Input */}
                <div className="relative">
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        required
                        value={loginData.password}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                        placeholder="Password"
                        disabled={isLoading}
                        autoComplete="current-password"
                    />
                    <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />

                    {/* Password visibility toggle */}
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        tabIndex="-1"
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={handleRememberMeChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            disabled={isLoading}
                            id="remember-me"
                        />
                        <span className="text-gray-900">Remember me</span>
                    </label>
                    <button
                        onClick={handleForgotPasswordClick}
                        type="button"
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
                    type="button"
                    className="font-medium text-green-600 hover:text-green-500"
                    disabled={isLoading}
                >
                    Sign up
                </button>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassModal && (
                <ForgotPassModal
                    isOpen={showForgotPassModal}
                    onClose={handleCloseForgotPassModal}
                    onSuccess={handlePasswordResetSuccess}
                    initialEmail={loginData.email}
                />
            )}
        </div>
    );
};

export default GrantSeekerLogin;
