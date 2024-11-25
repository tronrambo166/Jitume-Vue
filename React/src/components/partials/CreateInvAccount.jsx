import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo2 from "../../images/logo2.png";
import { useStateContext } from "../../contexts/contextProvider";
import axiosClient from "../../axiosClient";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAlert } from "../partials/AlertContext";

function CreateInvestorAccount({ isOpen, onClose }) {
    const [isSignIn, setIsSignIn] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { setUser, setToken } = useStateContext();
    const [loading, setLoading] = useState(false); // Loading state
    const [errors, setErrors] = useState({}); // Error state
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert
    const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me" checkbox

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

    const handleNext = () => setStep(step + 1);
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
        if (!registrationData.fname) {
            formErrors.push("First name is required!");
            showAlert("error", "First name is required!");
        }

        if (!registrationData.lname) {
            formErrors.push("Last name is required!");
            showAlert("error", "Last name is required!");
        }

        if (!registrationData.email) {
            formErrors.push("Email is required!");
            showAlert("error", "Email is required!");
        }

        if (!registrationData.password) {
            formErrors.push("Password is required!");
            showAlert("error", "Password is required!");
        }

        if (!registrationData.confirmPassword) {
            formErrors.push("Confirm password is required!");
            showAlert("error", "Confirm password is required!");
        }

        if (!registrationData.id_no) {
            formErrors.push("ID number is required!");
            showAlert("error", "ID number is required!");
        }

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
        <div className="fixed inset-0 bg-blue-900 bg-opacity-25 flex justify-center items-center z-50">
            <div
                className={`bg-white p-6 shadow-lg ${
                    isSignIn ? "max-w-md min-h-[500px]" : "max-w-2xl"
                } w-full h-auto no-scrollbar overflow-y-auto relative rounded-xl`}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-3xl bg-white border-none p-1 px-4 rounded-full"
                >
                    &times;
                </button>

                <div className="flex justify-center my-4">
                    <img
                        src={logo2}
                        alt="Logo"
                        className="w-[130px] h-[40px] object-contain"
                    />
                </div>

                <div className="flex justify-center mb-6 border-b border-gray-300 space-x-4">
                    <button
                        className={`px-4 py-2 text-sm ${
                            isSignIn
                                ? "font-semibold text-green-600 border-b-2 border-green-500" // Green color when selected
                                : "text-gray-600 hover:text-green-500" // Hover effect also green for consistency
                        }`}
                        onClick={() => setIsSignIn(true)}
                    >
                        Investor Sign In
                    </button>

                    <button
                        className={`px-4 py-2 text-sm ${
                            !isSignIn
                                ? "font-semibold text-green-600 border-b-2 border-green-500" // Green color when selected
                                : "text-gray-600 hover:text-green-500" // Hover effect also green for consistency
                        }`}
                        onClick={() => setIsSignIn(false)}
                    >
                        Create Investor Account
                    </button>
                </div>

                {isSignIn ? (
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
                                    type={showPassword ? "text" : "password"}
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
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                            <>
                                <div class="flex items-center space-x-2">
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
                                        class="text-sm text-gray-700"
                                    >
                                        Remember me
                                    </label>
                                </div>
                            </>

                            <a
                                href="#"
                                className="text-black hover:underline text-sm text-center"
                            >
                                Forgot Password?
                            </a>

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
                ) : (
                    <form
                        onSubmit={handleRegistrationSubmit}
                        className="flex flex-col items-center space-y-4"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Create Account
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {step === 1 && (
                                <>
                                    {" "}
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
                                            value={registrationData.fname}
                                            onChange={handleRegistrationChange}
                                            className="border rounded-lg px-3 py-2 w-full text-sm text-black"
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-gray-700 text-sm">
                                            Middle Name
                                        </label>
                                        <input
                                            type="text"
                                            name="mname"
                                            value={registrationData.mname}
                                            onChange={handleRegistrationChange}
                                            className="border rounded-lg px-3 py-2 w-full text-sm text-black"
                                        />
                                    </div>
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
                                            value={registrationData.lname}
                                            onChange={handleRegistrationChange}
                                            className="border rounded-lg px-3 py-2 w-full text-sm text-black"
                                            required
                                        />
                                    </div>
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
                                            value={registrationData.email}
                                            onChange={handleRegistrationChange}
                                            className="border rounded-lg px-3 py-2 w-full text-sm text-black"
                                            required
                                        />
                                    </div>
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
                                            value={registrationData.password}
                                            onChange={handleRegistrationChange}
                                            className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-8 text-gray-500 text-sm hover:text-primary transition-colors duration-200 ease-in-out"
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash />
                                            ) : (
                                                <FaEye />
                                            )}
                                        </button>
                                    </div>
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
                                            onChange={handleRegistrationChange}
                                            className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={
                                                toggleConfirmPasswordVisibility
                                            }
                                            className="absolute right-3 top-8 text-gray-500 text-sm hover:text-primary transition-colors duration-200 ease-in-out"
                                        >
                                            {showConfirmPassword ? (
                                                <FaEyeSlash />
                                            ) : (
                                                <FaEye />
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    {" "}
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
                                            value={registrationData.id_no}
                                            onChange={handleRegistrationChange}
                                            className="border rounded-lg px-3 py-2 w-full text-sm text-black"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm  mb-1">
                                            Tax PIN
                                            <span className="text-red-500 px-1">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="tax_pin"
                                            value={registrationData.tax_pin}
                                            onChange={handleRegistrationChange}
                                            className="border rounded-lg px-3 py-2 w-full text-sm text-black focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm mb-1">
                                            Attach ID/Passport{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="file"
                                            name="id_passport"
                                            onChange={handleRegistrationChange}
                                            className="border rounded-lg px-3 py-2 w-full text-sm text-black file:border-none file:bg-blue-100 file:text-blue-700 file:rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm mb-1">
                                            PIN{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="file"
                                            name="pin"
                                            onChange={handleRegistrationChange}
                                            className="border rounded-lg px-3 py-2 w-full text-sm text-black file:border-none file:bg-blue-100 file:text-blue-700 file:rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm mb-1">
                                            Past Investment
                                        </label>
                                        <input
                                            type="text"
                                            name="past_investment"
                                            value={
                                                registrationData.past_investment
                                            }
                                            onChange={handleRegistrationChange}
                                            className="border rounded-lg px-3 py-2 w-full text-sm text-black focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm mb-1">
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            name="website"
                                            value={registrationData.website}
                                            onChange={handleRegistrationChange}
                                            className="border rounded-lg px-3 py-2 w-full text-sm text-black focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-gray-700 text-sm mb-1">
                                            Potential Investment Range
                                        </label>
                                        <div
                                            className="border rounded-lg px-3 py-2 text-sm cursor-pointer text-black focus:ring-2 focus:ring-blue-500"
                                            onClick={() =>
                                                handleDropdownToggle(
                                                    "invRangeOpen"
                                                )
                                            }
                                        >
                                            {registrationData.inv_range.length >
                                            0
                                                ? registrationData.inv_range.join(
                                                      ", "
                                                  )
                                                : "Select ranges"}
                                        </div>
                                        {dropdowns.invRangeOpen && (
                                            <div className="absolute bg-white border rounded-lg text-black mt-2 w-full shadow-lg z-10 max-h-60 overflow-y-auto">
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
                                                        className="block p-2 cursor-pointer hover:bg-blue-50"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            name={range}
                                                            checked={registrationData.inv_range.includes(
                                                                range
                                                            )}
                                                            onChange={(e) =>
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
                                            Which industries are you interested
                                            in investing?
                                        </label>
                                        <div
                                            className="border rounded-lg px-3 py-2 text-sm cursor-pointer focus:ring-2 text-black focus:ring-blue-500"
                                            onClick={() =>
                                                handleDropdownToggle(
                                                    "industriesOpen"
                                                )
                                            }
                                        >
                                            {registrationData.interested_cats
                                                .length > 0
                                                ? registrationData.interested_cats.join(
                                                      ", "
                                                  )
                                                : "Select industries"}
                                        </div>
                                        {dropdowns.industriesOpen && (
                                            <div className="absolute bg-white border text-black rounded-lg mt-2 w-full shadow-lg z-10 max-h-48 overflow-y-auto">
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
                                                        className="block p-2 cursor-pointer hover:bg-blue-50"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            name={industry}
                                                            checked={registrationData.interested_cats.includes(
                                                                industry
                                                            )}
                                                            onChange={(e) =>
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
                                    <div className="flex items-center space-x-2 mt-4">
                                        <input
                                            type="checkbox"
                                            name="terms"
                                            checked={registrationData.terms}
                                            onChange={handleRegistrationChange}
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
                                     <button
                                        type="submit"
                                        className="btn btn-primary rounded-full mt-4 flex items-center justify-center"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                                        ) : (
                                            "Create Account"
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="btn bg-gray-500 hover:bg-gray-600 rounded-full mt-4 flex items-center justify-center"
                                    >
                                        Back
                                    </button>
                                   
                                </>
                            )}
                        </div>
                        {step < 2 && (
                            <div className="flex ml-80">
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="btn btn-primary px-20 rounded-full flex items-center justify-center"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}

export default CreateInvestorAccount;
