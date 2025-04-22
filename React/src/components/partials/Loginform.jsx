import { useState, useRef, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
    AiOutlineEye,
    AiOutlineEyeInvisible,
    AiOutlineLoading3Quarters,
} from "react-icons/ai";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextProvider";
import { useAlert } from "../partials/AlertContext";
import ForgotPassModal from "./ForgotPassModal";
const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [serverError, setServerError] = useState(""); // Server-side error message
    const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me" checkbox

    const emailRef = useRef();
    const passwordRef = useRef();
    const { setUser, setToken } = useStateContext();
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert

    const location = useLocation();
    const isListing = location.pathname.startsWith("/listing/");

    // Set rememberMe state from localStorage when the component mounts
    useEffect(() => {
        const savedRememberMe = JSON.parse(localStorage.getItem("rememberMe"));
        if (savedRememberMe) {
            setRememberMe(true);
            const savedEmail = localStorage.getItem("savedEmail");
            if (savedEmail) {
                emailRef.current.value = savedEmail; // Autofill email if stored
            }
        }
    }, []);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Validate email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Handle input changes for form validation
    const handleInputChange = () => {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        // Validate email and password
        let valid = true;
        // if (!email) {
        //     setEmailError("Please insert your email.");
        //     valid = false;
        // } else if (!validateEmail(email)) {
        //     setEmailError("Please enter a valid email.");
        //     valid = false;
        // } else {
        //     setEmailError("");
        // }

        // if (!password) {
        //     setPasswordError("Please insert your password.");
        //     valid = false;
        // } else {
        //     setPasswordError("");
        // }

        setIsFormValid(valid && email && password);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setServerError(""); // Reset server error

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
            browserLoginCheck: 1,
        };

        try {
            const { data } = await axiosClient.post("/login", payload);
            if (data.auth) {
                // Save the email and rememberMe status if login is successful
                if (rememberMe) {
                    localStorage.setItem("savedEmail", emailRef.current.value);
                    localStorage.setItem("rememberMe", true);
                } else {
                    localStorage.removeItem("savedEmail");
                    localStorage.removeItem("rememberMe");
                }

                const userName = `${data.user.fname}`;
                showAlert("success", `Login successful! Welcome, ${userName}`);
                setUser(data.user);
                setToken(data.token);

                // Listing Details page;
                if(isListing)
                    window.location.reload();

            } else {
                setServerError(data.message || "Login failed.");
                showAlert("error", data.message || "Login failed.");
            }
        } catch (error) {
            setServerError("Login failed. Server Error!.");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form
                className="flex flex-col px-4 sm:px-6 space-y-3 "
                style={{ maxHeight: "calc(100vh - 150px)" }}
                onSubmit={handleSubmit}
            >
                <div className="text-center pt-1">
                    <h1 className="font-semibold text-gray-700 text-md">
                        Sign In
                    </h1>
                    <h2 className="pt-2 text-gray-700 text-sm">
                        Enter details to log in
                    </h2>
                </div>
                <label className="text-[#666666] text-[13px]">
                    Email
                    <input
                        ref={emailRef}
                        type="email"
                        placeholder="Email"
                        className={`border p-3 rounded-xl w-full ${
                            emailError ? "border-red-500" : ""
                        }`}
                        onChange={handleInputChange}
                        required
                    />
                    {emailError && (
                        <p className="text-red-500 text-xs mt-1">
                            {emailError}
                        </p>
                    )}
                </label>
                <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                        <label className="text-[#666666] text-[13px] flex-grow pr-2">
                            Password
                        </label>
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="text-[#666666] py-2 text-[12px] flex items-center space-x-1"
                        >
                            {showPassword ? (
                                <AiOutlineEyeInvisible />
                            ) : (
                                <AiOutlineEye />
                            )}
                            <span>{showPassword ? "Hide" : "Show"}</span>
                        </button>
                    </div>
                    <input
                        ref={passwordRef}
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        className={`border rounded-xl p-3 w-full text-gray-500 ${
                            passwordError ? "border-red-500" : ""
                        }`}
                        onChange={handleInputChange}
                        required
                    />
                    {passwordError && (
                        <p className="text-red-500 text-xs mt-1">
                            {passwordError}
                        </p>
                    )}
                </div>

                {serverError && (
                    <p className="text-red-500 text-xs mt-1 text-center">
                        {serverError}
                    </p>
                )}

                <div class="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                    />
                    <label htmlFor="rememberMe" class="text-sm text-gray-700">
                        Remember me
                    </label>
                </div>

                <button
                    type="submit"
                    className={`px-4 py-2 rounded-full text-white flex items-center justify-center transition min-w-[120px] ${
                        loading
                            ? "bg-green/50 cursor-not-allowed"
                            : "bg-green hover:bg-green-600"
                    }`}
                    disabled={loading}
                    aria-busy={loading}
                    aria-disabled={loading}
                >
                    {loading ? (
                        <AiOutlineLoading3Quarters className="animate-spin text-2xl" />
                    ) : (
                        "Proceed"
                    )}
                </button>
            </form>
            <div className="text-center py-4">
                <a
                    href="#"
                    className="text-center hover:text-green text-black underline text-[14px]"
                    onClick={handleModalToggle}
                >
                    Forgot Password
                </a>
                {isModalOpen && <ForgotPassModal onClose={handleModalToggle} />}
            </div>
        </>
    );
};

export default LoginForm;
