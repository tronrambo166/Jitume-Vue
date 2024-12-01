import React, { useState, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";
import logo2 from "../../images/logo2.png";
import { useStateContext } from "../../contexts/contextProvider";
import axiosClient from "../../axiosClient";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAlert } from "../partials/AlertContext";
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
    const inputRefs = useRef([]);
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
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
        } else if (registrationData.password.length < 6) {
            errors.password = "Password must be at least 6 characters.";
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

    const handleNext = async () => {
        const validationErrors = validateStepOne();
        setErrors(validationErrors); // Assuming you have a state for errors

        // If there are validation errors, don't proceed to the next step
        if (Object.keys(validationErrors).length > 0) {
            return; // Don't proceed if there are errors
        }

        // Set loading to true when starting the async operation
        setLoading(true);

        // Now that synchronous validation passed, check for email validity
        const emailValid = await validateEmailExists(); // Call validateEmailExists

        // Set loading to false after the async operation completes
        setLoading(false);

        if (emailValid) {
            // Proceed to the next step only if email is valid and no errors are present
            setStep(step + 1);
        }
    };


    const handleBack = () => setStep(step - 1);

    if (!isOpen) return null;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleDropdown = (dropdown) => {
        setDropdowns((prev) => ({
            ...prev,
            [dropdown]: !prev[dropdown],
        }));
    };
    // otp otp otp
    const handleInput = (e, index) => {
        const { value } = e.target;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const pastedData = e.clipboardData
            .getData("text")
            .split("")
            .slice(0, 4);
        setOtp(pastedData);
        pastedData.forEach((value, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = value;
            }
        });
    };
    const handleSubmit = () => {
        console.log("OTP Submitted:", otp.join(""));
        // Handle OTP submission logic
    };

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
            if (data.token) {
                setUser(data.user);
                setToken(data.token);
                showAlert(
                    "success",
                    `Login successful! Welcome, ${data.user.name}`
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

    const handleDropdownToggle = (type) => {
        setDropdowns((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    const isFormValid = loginData.email && loginData.password;

    const handleRegistrationSubmit = async (e) => {
        e.preventDefault();

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

        setLoading(true); // Start loading spinner

        try {
            // Prepare form data for submission
            const submitData = new FormData();
            submitData.append("fname", registrationData.fname); // First Name
            submitData.append("mname", registrationData.mname || ""); // Optional Middle Name
            submitData.append("lname", registrationData.lname); // Last Name
            submitData.append("email", registrationData.email); // Email
            submitData.append("password", registrationData.password); // Password
            submitData.append("id_no", registrationData.id_no); // ID/Passport Number
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
            setLoading(false); // Stop loading spinner
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div
                className={`bg-white p-6 shadow-lg w-full ${
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
                                ? "font-semibold text-green-600 border-b-2 border-green-500"
                                : "text-gray-600 hover:text-green-500"
                        }`}
                        onClick={() => setIsSignIn(true)}
                    >
                        Investor Sign In
                    </button>
                    <button
                        className={`px-4 py-2 text-sm ${
                            !isSignIn
                                ? "font-semibold text-green-600 border-b-2 border-green-500"
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
                                            className="border rounded-lg px-3 text-black py-2 text-sm"
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
                                            className="border border-gray-300 rounded-lg px-3 py-2 text-black text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
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

                                            <div className="mt-4 flex justify-center md:justify-end">
                                                <button
                                                    type="button"
                                                    onClick={handleNext}
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
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 overflow-y-auto no-scrollbar">
                                            <div className="relative">
                                                <label className="block text-gray-700 text-sm mb-1">
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
                                                    <div className="absolute bg-gray-50 border rounded-lg text-black mt-2 w-full  z-10 max-h-36 overflow-y-auto scroll-thin">
                                                        {[
                                                            "0-10000",
                                                            "0-100000",
                                                            "10000-100000",
                                                            "100000-250000",
                                                            "250000-500000",
                                                            "500000-",
                                                        ].map((range) => (
                                                            <label
                                                                key={range}
                                                                className="block p-2 cursor-pointer hover:bg-green-50"
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
                                                                {range}
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="relative">
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
                                                    <div className="absolute bg-gray-50  text-black rounded-lg mt-2 w-full  border z-10 max-h-36 overflow-y-auto scroll-thin">
                                                        {[
                                                            "Agriculture",
                                                            "Arts/Culture",
                                                            "Sports/Gaming",
                                                            "Auto",
                                                            "Real State",
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
                                                                className="block p-2 cursor-pointer hover:bg-green-50"
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
                                                                {industry}
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
                                        <div className="flex mt-5 items-center justify-between ">
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                className="btn bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center w-1/3"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary rounded-full flex items-center justify-center  sm:w-1/3 sm:ml-auto"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                                                ) : (
                                                    "Create Account"
                                                )}
                                            </button>
                                        </div>
                                    </>
                                )}

                                {step === 3 && (
                                    <>
                                        <div className="  text-center mb-4">
                                            <h1 className="text-lg text-gray-700">
                                                Registration
                                            </h1>
                                            <h2 className="text-md text-gray-700 mr-2">
                                                Step 3 of 3
                                            </h2>
                                            <div className="text-center mb-4">
                                                <section className="bg-white text-gray-600 dark:bg-dark p-4 rounded-lg">
                                                    <form
                                                        id="otp-form"
                                                        className="flex gap-2 justify-center mb-4"
                                                        onPaste={handlePaste}
                                                    >
                                                        {otp.map(
                                                            (digit, index) => (
                                                                <input
                                                                    key={index}
                                                                    type="text"
                                                                    maxLength={
                                                                        1
                                                                    }
                                                                    value={
                                                                        digit
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleInput(
                                                                            e,
                                                                            index
                                                                        )
                                                                    }
                                                                    onKeyDown={(
                                                                        e
                                                                    ) =>
                                                                        handleKeyDown(
                                                                            e,
                                                                            index
                                                                        )
                                                                    }
                                                                    ref={(el) =>
                                                                        (inputRefs.current[
                                                                            index
                                                                        ] = el)
                                                                    }
                                                                    className="shadow-xs flex w-[64px] items-center justify-center rounded-lg border border-stroke bg-white p-2 text-center text-2xl font-medium text-gray-900 outline-none dark:border-dark-3 dark:bg-white/5"
                                                                />
                                                            )
                                                        )}
                                                    </form>
                                                    <div>
                                                        <button
                                                            type="button"
                                                            onClick={handleBack}
                                                            className="btn bg-gray-500 hover:bg-gray-600  text-white rounded-full flex items-center justify-center w-1/3"
                                                        >
                                                            Back
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                handleSubmit
                                                            }
                                                            className="bg-green-600 hover:bg-green-700 w-full text-white px-4 py-2 rounded-full flex items-center justify-center"
                                                        >
                                                            Verify
                                                            <FaCheck className="ml-2" />
                                                        </button>
                                                    </div>
                                                </section>
                                            </div>
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
