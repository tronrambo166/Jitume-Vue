import React, { useState, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";
import logo2 from "../../images/Tujitumelogo.svg";
import { useStateContext } from "../../contexts/contextProvider";
import axiosClient from "../../axiosClient";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAlert } from "../partials/AlertContext";
import { Bars } from "react-loader-spinner"; // Import Bars loader

import Fogts from "./Fogts";
function CreateInvestorAccount({ isOpen, onClose }) {
    const [isSignIn, setIsSignIn] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { setUser, setToken } = useStateContext();
    const [loading, setLoading] = useState(false); // Loading state
    const [errors, setErrors] = useState({}); // Error state
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert
    const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me" checkbox
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [loadingsubmit, setLoadingsubmit] = useState(false);
    const inputRefs = useRef([]);
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
        browserLoginCheck: 1,
    });

    const [registrationData, setRegistrationData] = useState({
        fname: "",
        mname: "",
        lname: "",
        email: "",
        password: "",
        confirmPassword: "",
        id_passport: "",
        tax_pin: "",
        attached_id: null,
        pin: null,
        investor: 1,
        id_no: "",
        past_investment: "",
        website: "",
        terms: false,
        inv_range: [],
        interested_cats: [],
    });
    const [dropdowns, setDropdowns] = useState({
        invRangeOpen: false,
        industriesOpen: false,
    });

    const [step, setStep] = useState(1);

    const validateStepOne = () => {
        const errors = {};

        if (!registrationData.fname.trim())
            errors.fname = "First name is required.";
        if (!registrationData.lname.trim())
            errors.lname = "Last name is required.";
        if (!registrationData.email.trim()) {
            errors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(registrationData.email)) {
            errors.email = "Email address is invalid.";
        }
        if (!registrationData.password) {
            errors.password = "Password is required.";
        } else if (registrationData.password.length < 8) {
            errors.password = "Password must be at least 8 characters.";
        } else if (!/[A-Z]/.test(registrationData.password)) {
            errors.password =
                "Password must contain at least one uppercase letter.";
        } else if (!/[a-z]/.test(registrationData.password)) {
            errors.password =
                "Password must contain at least one lowercase letter.";
        } else if (!/\d/.test(registrationData.password)) {
            errors.password = "Password must contain at least one number.";
        } else if (!/[^A-Za-z0-9]/.test(registrationData.password)) {
            errors.password =
                "Password must contain at least one special character.";
        }
        if (registrationData.password !== registrationData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }
        if (!registrationData.id_no.trim())
            errors.id_no = "ID/Passport Number is required.";
        if (!registrationData.tax_pin.trim())
            errors.tax_pin = "Tax PIN is required.";
        console.log(errors);

        return errors;
    };

    const validateEmailExists = async () => {
        try {
            const { data } = await axiosClient.get(
                "emailExists/" + registrationData.email
            );
            if (data.status === 400) {
                showAlert("error", "Email already exists!");
                return false;
            }
            return true;
        } catch (error) {
            console.log(error);
            showAlert("error", "An error occurred while checking the email.");
            return false;
        }
    };

    // ///////////////////////////////////////////////////////////////////////////////////
    const [vcode, setVCode] = useState(null);

    const [otpSent, setOtpSent] = useState(false); // Track if OTP is sent

    // console.log("OTP sent:", otpSent);
    // console.log("OTP sent:", vcode);

    const handleNext = async () => {
        const validationErrors = validateStepOne();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            console.log("Validation failed:", validationErrors); // Debugging
            return;
        }

        setLoading(true);

        const emailValid = await validateEmailExists();
        setLoading(false);

        if (!emailValid) {
            console.log("Email validation failed");
            return;
        }

        if (step === 2 && !otpSent) {
            setOtpSent(true);
            sendVerificationEmail();
        }

        setStep((prevStep) => prevStep + 1);
    };

    const sendVerificationEmail = async () => {
        if (otpSent) return; // Prevent duplicate calls

        setOtpSent(true); // Ensure it is set before calling API

        const code = String(Math.floor(1000 + Math.random() * 9000));
        const verify = await emailVerify(code);

        if (verify) {
            showAlert(
                "info",
                "Verification email sent successfully. Please check your inbox."
            );
        } else {
            showAlert(
                "error",
                "Failed to send verification email. Please try again."
            );
            setOtpSent(false); // Reset OTP sent state if it fails
        }
    };

    const emailVerify = async (code) => {
        try {
            setLoading(true);
            const { data } = await axiosClient.get(
                `emailVerify/${registrationData.email}/${code}`
            );
            setLoading(false);

            if (data.status === 200) {
                setVCode(code);
                return true;
            } else {
                showAlert("error", data.message || "Email not sent.");
                return false;
            }
        } catch (error) {
            setLoading(false);
            console.error("Error during email verification:", error);
            showAlert(
                "error",
                error.response?.data?.message || "An error occurred."
            );
            return false;
        }
    };
    const invRangeRef = useRef(null);
    const industriesRef = useRef(null);

    // Handle clicks outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                invRangeRef.current &&
                !invRangeRef.current.contains(event.target)
            ) {
                setDropdowns((prev) => ({ ...prev, invRangeOpen: false }));
            }
            if (
                industriesRef.current &&
                !industriesRef.current.contains(event.target)
            ) {
                setDropdowns((prev) => ({ ...prev, industriesOpen: false }));
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDropdownToggle = (dropdown) => {
        setDropdowns((prev) => ({
            ...prev,
            [dropdown]: !prev[dropdown],
        }));
    };

    // ////////////////////////////////////////////////////////////

    // Handle input focus
    const handleFocus = (e) => {
        e.target.select(); // Select the content when the input is focused
    };
    const handleInput = (e) => {
        const { target } = e;
        const index = inputRefs.current.indexOf(target);

        if (target.value) {
            setOtp((prevOtp) => {
                const updatedOtp = [
                    ...prevOtp.slice(0, index),
                    target.value,
                    ...prevOtp.slice(index + 1),
                ];
                const otpCode = updatedOtp.join("");

                // Submit when all fields are filled
                if (otpCode.length === otp.length) {
                    if (vcode === otpCode) {
                        handleRegistrationSubmit();
                        setLoading(true);
                    } else {
                        showAlert("error", "Invalid OTP. Please try again.");
                        setLoading(false);
                    }
                }

                return updatedOtp;
            });

            // Move focus to the next input field
            if (index < otp.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text").slice(0, otp.length);

        if (/^\d+$/.test(text)) {
            const digits = text.split("");
            setOtp(digits);
            inputRefs.current[otp.length - 1].focus();

            // Auto-submit if pasted OTP is complete
            if (digits.length === otp.length) {
                const otpCode = text;
                if (vcode === otpCode) {
                    handleRegistrationSubmit();
                    setLoading(true);
                } else {
                    showAlert("error", "Invalid OTP. Please try again.");
                    setLoading(false);
                }
            }
        }
    };

    const handleKeyDown = (e) => {
        const index = inputRefs.current.indexOf(e.target);

        if (e.key === "Backspace" && otp[index] === "") {
            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        } else if (e.key === "Backspace" || e.key === "Delete") {
            setOtp((prevOtp) => [
                ...prevOtp.slice(0, index),
                "",
                ...prevOtp.slice(index + 1),
            ]);
        }
    };

    // ///////////////////////////////////////////////////////////////////////////////////

    const handleBack = () => setStep(step - 1);

    if (!isOpen) return null;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // otp otp otp

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleCheckboxChange = (e, category) => {
        const { name, checked } = e.target;
        setRegistrationData((prev) => {
            const updatedList = checked
                ? [...prev[category], name]
                : prev[category].filter((item) => item !== name);

            return {
                ...prev,
                [category]: updatedList,
            };
        });
    };

    const handleRegistrationChange = (e) => {
        const { name, value, type, files, checked } = e.target;
        setRegistrationData((prev) => ({
            ...prev,
            [name]:
                type === "file"
                    ? files[0] // This ensures you're correctly handling file inputs for `id_passport` and `pin`
                    : type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const validateLogin = () => {
        const newErrors = {};
        if (!loginData.email) {
            newErrors.email = "Email is required";
        }
        if (!loginData.password) {
            newErrors.password = "Password is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // OTP OTP OTP

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        if (!validateLogin()) {
            return; // Stop submission if there are validation errors
        }

        setLoading(true); // Start loading spinner

        try {
            const { data } = await axiosClient.post("/login", loginData);
            console.log(data);
            if (data.auth) {
                setUser(data.user);
                setToken(data.token);
                showAlert(
                    "success",
                    `Login successful! Welcome, ${data.user.fname}`
                ); // Show success alert
                onClose(); // Close the modal
            } else {
                showAlert("error", "Wrong credentials. Please try again."); // Show error alert
            }
        } catch (error) {
            showAlert("error", "An error occurred. Please try again later."); // Show error alert
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };

    // const handleDropdownToggle = (type) => {
    //     setDropdowns((prev) => ({
    //         ...prev,
    //         [type]: !prev[type],
    //     }));
    // };

    const isFormValid = loginData.email && loginData.password;

    const handleRegistrationSubmit = async (e) => {
        // e.preventDefault();
        if (e) e.preventDefault();

        let formErrors = [];

        if (!registrationData.tax_pin) {
            formErrors.push("Tax PIN is required!");
            showAlert("error", "Tax PIN is required!");
        }

        if (!registrationData.id_passport) {
            formErrors.push("Attach your ID/Passport!");
            showAlert("error", "Attach your ID/Passport!");
        }

        if (!registrationData.pin) {
            formErrors.push("Attach your PIN file!");
            showAlert("error", "Attach your PIN file!");
        }

        // If there are any validation errors, stop the registration process
        if (formErrors.length > 0) {
            setErrors({ general: formErrors });
            return;
        }

        setLoadingsubmit(true); // Start loading spinner

        try {
            // Prepare form data for submission
            const submitData = new FormData();
            submitData.append("fname", registrationData.fname); // First Name
            submitData.append("mname", registrationData.mname || ""); // Optional Middle Name
            submitData.append("lname", registrationData.lname); // Last Name
            submitData.append("email", registrationData.email); // Email
            submitData.append("password", registrationData.password); // Password
            submitData.append("id_no", registrationData.id_no); // ID/Passport Number
            submitData.append("investor", 1);
            submitData.append("tax_pin", registrationData.tax_pin); // Tax PIN
            submitData.append("id_passport", registrationData.id_passport); // Attached ID/Passport
            submitData.append(
                "confirmPassword",
                registrationData.confirmPassword
            );
            submitData.append("pin", registrationData.pin); // Attached PIN
            submitData.append(
                "past_investment",
                registrationData.past_investment
            ); // Past Investment
            submitData.append("website", registrationData.website); // Website (Optional)
            submitData.append("inv_range", registrationData.inv_range); // Investment Range
            submitData.append(
                "interested_cats",
                registrationData.interested_cats
            ); // Interested Categories

            console.log(registrationData);

            // Submit the registration data
            const { data } = await axiosClient.post("/register", submitData);

            // Check for backend-specific errors (e.g., if the email already exists)
            if (data.error) {
                formErrors.push(data.error);
                showAlert("error", data.error); // Show backend-specific error alert
                setErrors({ general: formErrors });
                return;
            }

            showAlert("success", "Registration successful!"); // Show success alert
            setStep(1);

            onClose();
        } catch (error) {
            // Handle backend errors
            if (error.response) {
                const errorMessage =
                    error.response.data.message ||
                    "Registration failed. Please try again.";
                formErrors.push(errorMessage);
                showAlert("error", errorMessage); // Show error alert
                setErrors({ general: formErrors });
            } else if (error.request) {
                const errorMessage =
                    "No response from the server. Please try again.";
                formErrors.push(errorMessage);
                showAlert("error", errorMessage); // Show error alert
                setErrors({ general: formErrors });
            } else {
                const errorMessage =
                    "An unexpected error occurred. Please try again.";
                formErrors.push(errorMessage);
                showAlert("error", errorMessage); // Show error alert
                setErrors({ general: formErrors });
            }

            console.log(error); // Log the error for debugging
        } finally {
            setLoadingsubmit(false); // Stop loading spinner
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-start z-50 overflow-y-auto">
            <div
                className={`bg-white  rounded-xl m-3 p-4 sm:p-6 relative w-[95vw] max-w-[500px] sm:w-[85vw] sm:max-w-[450px] lg:w-[70vw] lg:max-w-[500px] mx-auto mt-3 sm:mt-20 overflow-hidden ${
                    isSignIn ? "max-w-md min-h-[500px]" : "max-w-2xl"
                } max-h-[100vh] overflow-hidden relative rounded-xl flex flex-col`}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-3xl bg-white border-none p-1 px-4 rounded-full"
                >
                    &times;
                </button>

                {/* Header part */}
                <div className="flex justify-center my-4">
                    <img
                        src={logo2}
                        alt="Logo"
                        className="w-[130px] h-[40px] object-contain"
                    />
                </div>

                <div className="flex justify-center mb-6 border-b border-gray-300 space-x-12">
                    <button
                        className={`px-4 py-2 text-sm ${
                            isSignIn
                                ? "font-semibold text-green-600 underline border-green-500"
                                : "text-gray-600 hover:text-green-500"
                        }`}
                        onClick={() => setIsSignIn(true)}
                    >
                        Investor Sign In
                    </button>
                    <button
                        className={`px-4 py-2 text-sm ${
                            !isSignIn
                                ? "font-semibold text-green-600 underline  border-green-500"
                                : "text-gray-600 hover:text-green-500"
                        }`}
                        onClick={() => setIsSignIn(false)}
                    >
                        Create Investor Account
                    </button>
                </div>

                {/* Content area without scrollbar */}
                <div className=" scroll-thin overflow-hidden flex-1 max-h-[70vh]">
                    {isSignIn ? (
                        <>
                            <form
                                onSubmit={handleLoginSubmit}
                                className="flex flex-col items-center space-y-4"
                            >
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    Sign In
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Enter your details to log in
                                </p>

                                <div className="flex flex-col w-full max-w-sm space-y-4">
                                    <div className="flex flex-col">
                                        <label className="text-gray-700 text-sm">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={loginData.email}
                                            onChange={handleLoginChange}
                                            className="border rounded-lg px-3 text-black py-3 text-sm"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col relative space-y-1">
                                        <label className="text-gray-700 text-sm font-medium">
                                            Password
                                        </label>
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={loginData.password}
                                            onChange={handleLoginChange}
                                            className="border border-gray-300 rounded-lg px-3 py-3 text-black text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-8 text-gray-500 hover:text-primary text-sm transition-colors duration-200 ease-in-out"
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash />
                                            ) : (
                                                <FaEye />
                                            )}
                                        </button>
                                        {errors.password && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="rememberMe"
                                            checked={rememberMe}
                                            onChange={() =>
                                                setRememberMe(!rememberMe)
                                            }
                                        />
                                        <label
                                            htmlFor="rememberMe"
                                            className="text-sm text-gray-700"
                                        >
                                            Remember me
                                        </label>
                                    </div>

                                    {errors.general && (
                                        <p className="text-red-500 text-xs">
                                            {errors.general}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        className={`px-4 text-white py-2 rounded-full mt-2 flex items-center justify-center ${
                                            isFormValid
                                                ? "bg-green"
                                                : "bg-green/50 cursor-not-allowed"
                                        }`}
                                        disabled={!isFormValid || loading}
                                    >
                                        {loading ? (
                                            <AiOutlineLoading3Quarters className="animate-spin mr-2 text-lg" />
                                        ) : (
                                            "Log In"
                                        )}
                                    </button>
                                </div>
                            </form>
                            <Fogts />
                        </>
                    ) : (
                        <form
                            onSubmit={handleRegistrationSubmit}
                            className="flex flex-col items-center"
                        >
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Create Account
                            </h2>

                            <div className="max-w-4xl mx-auto p-4 overflow-x-hidden">
                                {step === 1 && (
                                    <>
                                        <div className="text-center mb-4">
                                            <h1 className="text-lg text-gray-700">
                                                Registration
                                            </h1>
                                            <h2 className="text-md text-gray-700 mr-2">
                                                Step 1 of 3
                                            </h2>
                                        </div>
                                        <hr className="my-4"></hr>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* First Name */}
                                            <div className="relative">
                                                <label className="block text-gray-700 text-sm">
                                                    First Name{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="fname"
                                                    value={
                                                        registrationData.fname
                                                    }
                                                    onChange={
                                                        handleRegistrationChange
                                                    }
                                                    className={`border rounded-lg px-3 py-2 w-full text-sm text-black ${
                                                        errors.fname
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    required
                                                />
                                                {errors.fname && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.fname}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Middle Name */}
                                            <div className="relative">
                                                <label className="block text-gray-700 text-sm">
                                                    Middle Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="mname"
                                                    value={
                                                        registrationData.mname
                                                    }
                                                    onChange={
                                                        handleRegistrationChange
                                                    }
                                                    className="border rounded-lg px-3 py-2 w-full text-sm text-black"
                                                />
                                            </div>

                                            {/* Last Name */}
                                            <div className="relative">
                                                <label className="block text-gray-700 text-sm">
                                                    Last Name{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lname"
                                                    value={
                                                        registrationData.lname
                                                    }
                                                    onChange={
                                                        handleRegistrationChange
                                                    }
                                                    className={`border rounded-lg px-3 py-2 w-full text-sm text-black ${
                                                        errors.lname
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    required
                                                />
                                                {errors.lname && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.lname}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Email */}
                                            <div className="relative">
                                                <label className="block text-gray-700 text-sm">
                                                    Email{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={
                                                        registrationData.email
                                                    }
                                                    onChange={
                                                        handleRegistrationChange
                                                    }
                                                    className={`border rounded-lg px-3 py-2 w-full text-sm text-black ${
                                                        errors.email
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    required
                                                />
                                                {errors.email && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Password */}
                                            <div className="relative flex flex-col space-y-1">
                                                <label className="block text-gray-700 text-sm font-medium">
                                                    Password{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    name="password"
                                                    value={
                                                        registrationData.password
                                                    }
                                                    onChange={
                                                        handleRegistrationChange
                                                    }
                                                    className={`border rounded-lg px-3 py-2 w-full text-sm text-black ${
                                                        errors.password
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={
                                                        togglePasswordVisibility
                                                    }
                                                    className="absolute right-3 top-8 text-gray-500 hover:text-primary"
                                                >
                                                    {showPassword ? (
                                                        <FaEyeSlash />
                                                    ) : (
                                                        <FaEye />
                                                    )}
                                                </button>
                                                {errors.password && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.password}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Confirm Password */}
                                            <div className="relative flex flex-col space-y-1">
                                                <label className="block text-gray-700 text-sm font-medium">
                                                    Confirm Password{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type={
                                                        showConfirmPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    name="confirmPassword"
                                                    value={
                                                        registrationData.confirmPassword
                                                    }
                                                    onChange={
                                                        handleRegistrationChange
                                                    }
                                                    className={`border rounded-lg px-3 py-2 w-full text-sm text-black ${
                                                        errors.confirmPassword
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={
                                                        toggleConfirmPasswordVisibility
                                                    }
                                                    className="absolute right-3 top-8 text-gray-500 hover:text-primary"
                                                >
                                                    {showConfirmPassword ? (
                                                        <FaEyeSlash />
                                                    ) : (
                                                        <FaEye />
                                                    )}
                                                </button>
                                                {errors.confirmPassword && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.confirmPassword}
                                                    </p>
                                                )}
                                            </div>

                                            {/* ID/Passport Number */}
                                            <div className="relative">
                                                <label className="block text-gray-700 text-sm">
                                                    ID/Passport Number{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="id_no"
                                                    value={
                                                        registrationData.id_no
                                                    }
                                                    onChange={
                                                        handleRegistrationChange
                                                    }
                                                    className={`border rounded-lg px-3 py-2 w-full text-sm text-black ${
                                                        errors.id_no
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    required
                                                />
                                                {errors.id_no && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.id_no}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Tax PIN */}
                                            <div className="relative">
                                                <label className="block text-gray-700 text-sm">
                                                    Tax PIN{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="tax_pin"
                                                    value={
                                                        registrationData.tax_pin
                                                    }
                                                    onChange={
                                                        handleRegistrationChange
                                                    }
                                                    className={`border rounded-lg px-3 py-2 w-full text-sm text-black ${
                                                        errors.tax_pin
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    required
                                                />
                                                {errors.tax_pin && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.tax_pin}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <hr className="my-4"></hr>

                                        <div className="mt-4 flex justify-center lg:justify-end">
                                            <button
                                                type="button"
                                                onClick={handleNext}
                                                // onClick={handleNext2}
                                                className="btn btn-primary px-20 rounded-full"
                                                disabled={loading} // Disable the button when loading
                                            >
                                                {loading ? (
                                                    <AiOutlineLoading3Quarters className="animate-spin w-6 h-6 text-white" /> // Spinner icon
                                                ) : (
                                                    "Next"
                                                )}
                                            </button>
                                        </div>
                                    </>
                                )}
                                {step === 2 && (
                                    <>
                                        {" "}
                                        <div className="  text-center mb-4">
                                            <h1 className="text-lg text-gray-700">
                                                Registration
                                            </h1>
                                            <h2 className="text-md text-gray-700 mr-2">
                                                Step 2 of 3
                                            </h2>
                                        </div>
                                        <hr className="my-4"></hr>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 overflow-y-auto no-scrollbar">
                                            {/* Investment Range Dropdown */}
                                            <div
                                                className="relative"
                                                ref={invRangeRef}
                                            >
                                                <label className="block text-gray-700 text-sm mt-4 mb-1">
                                                    Potential Investment{" "}
                                                    <span className="block">
                                                        Range
                                                    </span>
                                                </label>

                                                <div
                                                    className="border rounded-lg px-3 py-2 text-sm cursor-pointer text-black focus:ring-2 focus:ring-blue-500"
                                                    onClick={() =>
                                                        handleDropdownToggle(
                                                            "invRangeOpen"
                                                        )
                                                    }
                                                >
                                                    {registrationData.inv_range
                                                        .length > 0
                                                        ? registrationData.inv_range.join(
                                                              ", "
                                                          )
                                                        : "Select ranges"}
                                                </div>

                                                {dropdowns.invRangeOpen && (
                                                    <div className="absolute bg-gray-50 border rounded-lg text-black mt-2 w-full z-10 max-h-36 overflow-y-auto scroll-thin shadow-lg">
                                                        {[
                                                            "0-10000",
                                                            "0-100000",
                                                            "10000-100000",
                                                            "100000-250000",
                                                            "250000-500000",
                                                            "500000+",
                                                        ].map((range) => (
                                                            <label
                                                                key={range}
                                                                className="flex items-center p-2 cursor-pointer hover:bg-green-50"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    name={range}
                                                                    checked={registrationData.inv_range.includes(
                                                                        range
                                                                    )}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleCheckboxChange(
                                                                            e,
                                                                            "inv_range"
                                                                        )
                                                                    }
                                                                    className="mr-2"
                                                                />
                                                                <span className="text-xs">
                                                                    {range}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Industries Dropdown */}
                                            <div
                                                className="relative mt-4"
                                                ref={industriesRef}
                                            >
                                                <label className="block text-gray-700 text-sm mb-1">
                                                    Which industries are you
                                                    interested in investing?
                                                </label>

                                                <div
                                                    className="border rounded-lg px-3 py-2 text-sm cursor-pointer focus:ring-2 text-black focus:ring-blue-500"
                                                    onClick={() =>
                                                        handleDropdownToggle(
                                                            "industriesOpen"
                                                        )
                                                    }
                                                >
                                                    {registrationData
                                                        .interested_cats
                                                        .length > 0
                                                        ? registrationData.interested_cats.join(
                                                              ", "
                                                          )
                                                        : "Select industries"}
                                                </div>

                                                {dropdowns.industriesOpen && (
                                                    <div className="absolute bg-gray-50 text-black rounded-lg mt-2 w-full border z-10 max-h-36 overflow-y-auto scroll-thin shadow-lg">
                                                        {[
                                                            "Agriculture",
                                                            "Arts/Culture",
                                                            "Sports/Gaming",
                                                            "Auto",
                                                            "Real Estate",
                                                            "Food",
                                                            "Legal",
                                                            "Security",
                                                            "Media/Internet",
                                                            "Technology/Communications",
                                                            "Retail",
                                                            "Finance/Accounting",
                                                            "Pets",
                                                            "Domestic (Home Help etc)",
                                                        ].map((industry) => (
                                                            <label
                                                                key={industry}
                                                                className="flex items-center p-2 cursor-pointer hover:bg-green-50"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    name={
                                                                        industry
                                                                    }
                                                                    checked={registrationData.interested_cats.includes(
                                                                        industry
                                                                    )}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleCheckboxChange(
                                                                            e,
                                                                            "interested_cats"
                                                                        )
                                                                    }
                                                                    className="mr-2"
                                                                />
                                                                <span className="text-xs">
                                                                    {industry}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="relative">
                                                <label className="block text-gray-700 text-sm mb-1">
                                                    Attach ID/Passport{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="file"
                                                    name="id_passport"
                                                    onChange={
                                                        handleRegistrationChange
                                                    }
                                                    className="border rounded-lg px-3 py-2 w-full text-sm text-black file:border-none file:bg-blue-100 file:text-blue-700 file:rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>

                                            <div className="relative">
                                                <label className="block text-gray-700 text-sm mb-1">
                                                    PIN{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="file"
                                                    name="pin"
                                                    onChange={
                                                        handleRegistrationChange
                                                    }
                                                    className="border rounded-lg px-3 py-2 w-full text-sm text-black file:border-none file:bg-blue-100 file:text-blue-700 file:rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>

                                            <div className="relative">
                                                <label className="block text-gray-700 text-sm mb-1">
                                                    Past Investment
                                                </label>
                                                <input
                                                    type="text"
                                                    name="past_investment"
                                                    value={
                                                        registrationData.past_investment
                                                    }
                                                    onChange={
                                                        handleRegistrationChange
                                                    }
                                                    className="border rounded-lg px-3 py-2 w-full text-sm text-black focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div className="relative">
                                                <label className="block text-gray-700 text-sm mb-1">
                                                    Website
                                                </label>
                                                <input
                                                    type="url"
                                                    name="website"
                                                    value={
                                                        registrationData.website
                                                    }
                                                    onChange={
                                                        handleRegistrationChange
                                                    }
                                                    className="border rounded-lg px-3 py-2 w-full text-sm text-black focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 mt-4">
                                            <input
                                                type="checkbox"
                                                name="terms"
                                                checked={registrationData.terms}
                                                onChange={
                                                    handleRegistrationChange
                                                }
                                                className="mr-2"
                                            />
                                            <label className="text-gray-700 text-sm">
                                                I have read and agree to the{" "}
                                                <a
                                                    href="#"
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    Terms of Use
                                                </a>{" "}
                                                and{" "}
                                                <a
                                                    href="#"
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    Privacy Policy
                                                </a>
                                            </label>
                                        </div>
                                        <hr className="my-4"></hr>
                                        <div className="flex mt-5 items-center justify-between ">
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                className="btn bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center w-1/3"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="button" // Prevents unintended form submission
                                                onClick={handleNext}
                                                className="btn btn-primary whitespace-nowrap rounded-full flex items-center justify-center sm:w-1/3 sm:ml-auto"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                                                ) : (
                                                    "Next"
                                                )}
                                            </button>
                                        </div>
                                    </>
                                )}
                                {step === 3 && (
                                    <>
                                        <div className="text-center mb-4">
                                            <h1 className="text-lg text-[#666666]">
                                                Verification
                                            </h1>
                                            <h2 className="text-md font-semibold text-[#666666]">
                                                Step 3 of 3
                                                <p className="text-center py-2 text-gray-700 dark:text-gray-200 font-medium">
                                                    A verification code has been
                                                    sent to your &nbsp;
                                                    <strong className="text-green-600 dark:text-green-400">
                                                        email
                                                    </strong>
                                                </p>
                                            </h2>

                                            <section className="bg-white text-gray-600 dark:bg-dark">
                                                <div className="container">
                                                    {loadingsubmit ? ( // Show loader if loading is true
                                                        <div className="flex justify-center">
                                                            <Bars
                                                                height="80"
                                                                width="80"
                                                                color="#4fa94d"
                                                                ariaLabel="bars-loading"
                                                                wrapperStyle={{}}
                                                                wrapperClass=""
                                                                visible={true}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <form
                                                            id="otp-form"
                                                            className="flex gap-2 justify-center"
                                                        >
                                                            {otp.map(
                                                                (
                                                                    digit,
                                                                    index
                                                                ) => (
                                                                    <input
                                                                        id="otp"
                                                                        key={
                                                                            index
                                                                        }
                                                                        type="text"
                                                                        maxLength={
                                                                            1
                                                                        }
                                                                        value={
                                                                            digit
                                                                        }
                                                                        onChange={
                                                                            handleInput
                                                                        }
                                                                        onKeyDown={
                                                                            handleKeyDown
                                                                        }
                                                                        onFocus={
                                                                            handleFocus
                                                                        }
                                                                        onPaste={
                                                                            handlePaste
                                                                        }
                                                                        ref={(
                                                                            el
                                                                        ) =>
                                                                            (inputRefs.current[
                                                                                index
                                                                            ] =
                                                                                el)
                                                                        }
                                                                        className="shadow-xs flex w-[64px] items-center justify-center rounded-lg border border-stroke bg-white p-2 text-center text-2xl font-medium text-gray-5 outline-none sm:text-4xl dark:border-dark-3 dark:bg-white/5"
                                                                    />
                                                                )
                                                            )}
                                                        </form>
                                                    )}
                                                </div>
                                            </section>
                                        </div>
                                    </>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CreateInvestorAccount;
