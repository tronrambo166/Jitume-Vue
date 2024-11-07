import { useState, useRef } from "react";
import {
    AiOutlineEye,
    AiOutlineEyeInvisible,
    AiOutlineLoading3Quarters,
} from "react-icons/ai";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextProvider";

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [serverError, setServerError] = useState(""); // Server-side error message

    const emailRef = useRef();
    const passwordRef = useRef();
    const { setUser, setToken } = useStateContext();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleInputChange = () => {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        // Validate email and password
        let valid = true;
        if (!email) {
            // setEmailError("Please insert your email.");
            valid = false;
        } else if (!validateEmail(email)) {
            // setEmailError("Please enter a valid email.");
            valid = false;
        } else {
            setEmailError("");
        }

        if (!password) {
            // setPasswordError("Please insert your password.");
            valid = false;
        } else {
            setPasswordError("");
        }

        setIsFormValid(valid && email && password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setServerError(""); // Reset server error

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        try {
            const { data } = await axiosClient.post("/login", payload);
            console.log("Login response data:", data);

            if (data.auth) {
                setUser(data.user);
                setToken(data.token);
            } else {
                setServerError(
                    data.message ||
                        "Login failed. Please check your credentials."
                );
            }
        } catch (err) {
            setServerError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="flex flex-col px-6 space-y-4" onSubmit={handleSubmit}>
            <div className="text-center pt-1">
                <h1 className="font-semibold text-gray-700 text-md">Sign In</h1>
                <h2 className="pt-2 text-gray-700 text-sm">
                    Enter details to log in
                </h2>
            </div>
            <label className="text-[#666666] text-[13px] ">
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
                    <p className="text-red-500 text-xs mt-1">{emailError}</p>
                )}
            </label>
            <div className="flex flex-col ">
                <div className="flex items-center  justify-between">
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
                    className={`border rounded-xl p-3  w-full ${
                        passwordError ? "border-red-500" : ""
                    }`}
                    onChange={handleInputChange}
                    required
                />
                {passwordError && (
                    <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                )}
            </div>
            {serverError && (
                <p className="text-red-500 text-xs mt-1 text-center">
                    {serverError}
                </p>
            )}
           
            <button
                type="submit"
                className={`px-4 text-white py-2 rounded-full   flex items-center justify-center ${
                    isFormValid ? "bg-green" : "bg-green/50 cursor-not-allowed"
                }`}
                disabled={!isFormValid || loading}
            >
                {loading && (
                    <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                )}
                Proceed
            </button>

            <div className="text-center py-4">
                <a
                    href="http://"
                    className="text-center hover:text-green text-black underline text-[13px]"
                >
                    Forgot password
                </a>
            </div>
        </form>
    );
};

export default LoginForm;
