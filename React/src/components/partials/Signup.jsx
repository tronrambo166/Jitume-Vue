import googlerecaptcha from "../../images/googlerecaptcha.png";
import { useState } from "react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useStateContext } from "../../contexts/contextProvider";
import axiosClient from "../../axiosClient";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import StepThree from "./StepThree";
import { useAlert } from "../partials/AlertContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const RegisterForm = () => {
    const { setUser, setToken } = useStateContext();
    const [step, setStep] = useState(1);
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert

    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        dobMonth: "",
        dobDay: "",
        dobYear: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [isRecaptchaChecked, setIsRecaptchaChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
        password: "",
        confirmPassword: "",
        recaptcha: "",
    });

    const isValidDateOfBirth = () => {
        const { dobMonth, dobDay, dobYear } = formData;
        const month = parseInt(dobMonth, 10);
        const day = parseInt(dobDay, 10);
        const year = parseInt(dobYear, 10);

        // Validate month, day, and year inputs
        if (isNaN(month) || isNaN(day) || isNaN(year)) {
            return false;
        }

        if (year < 1900 || year > new Date().getFullYear()) {
            return false;
        }

        if (month < 1 || month > 12) {
            return false;
        }

        const daysInMonth = new Date(year, month, 0).getDate();
        if (day < 1 || day > daysInMonth) {
            return false;
        }

        // Check if the user is at least 18 years old
        const dob = new Date(year, month - 1, day); // JavaScript months are 0-based
        const todayMinus18Years = new Date();
        todayMinus18Years.setFullYear(todayMinus18Years.getFullYear() - 18);

        return dob <= todayMinus18Years;
    };
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   const handleTogglePassword = () => setShowPassword((prev) => !prev);
   const handleToggleConfirmPassword = () =>
       setShowConfirmPassword((prev) => !prev);

  const validateStep1 = () => {
      let valid = true;
      let newErrors = { ...errors };

      // First Name validation
      if (!formData.firstName) {
          newErrors.firstName = "First name is required.";
          valid = false;
      } else {
          newErrors.firstName = "";
      }

      // Last Name validation
      if (!formData.lastName) {
          newErrors.lastName = "Last name is required.";
          valid = false;
      } else {
          newErrors.lastName = "";
      }

      // Date of Birth validation
      if (!isValidDateOfBirth()) {
          newErrors.dob = "You must be at least 18 years old to register.";
          valid = false;
      } else {
          newErrors.dob = "";
      }

      setErrors(newErrors);
      return valid;
  };

    const handleTermsChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            isAgreedToTerms: e.target.checked,
        }));
    };
    const validateStep2 = () => {
        let valid = true;
        let newErrors = { ...errors };

        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required.";
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid.";
            valid = false;
        } else {
            newErrors.email = "";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required.";
            valid = false;
        } else {
            newErrors.password = "";
        }

        // Confirm Password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
            valid = false;
        } else {
            newErrors.confirmPassword = "";
        }

        // Recaptcha validation
        if (!formData.isRecaptchaChecked) {
            newErrors.recaptcha = "Please verify you are not a robot.";
            valid = false;
        } else {
            newErrors.recaptcha = "";
        }

        // Terms agreement validation
        if (!formData.isAgreedToTerms) {
            newErrors.terms =
                "You must agree to the Terms of Use and Privacy Policy.";
            valid = false;
        } else {
            newErrors.terms = "";
        }

        // Update state with new errors
        setErrors(newErrors);
        return valid;
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleNextStep = async () => {
        if (step === 1 && validateStep1()) {
            setStep(2); // Move to step 2
            showAlert("info", "You are now in Step 2.");
        } else if (step === 2 && validateStep2()) {
            // Call handleSubmit and only proceed if the submission is successful
            const isSuccess = await handleSubmit();
            if (isSuccess) {
                setStep(3); // Move to step 3 after successful submission
                showAlert(
                    "info",
                    "You are now in Step 3. Registration successful."
                );
            }
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);

        const formattedData = {
            fname: formData.firstName,
            mname: formData.middleName,
            lname: formData.lastName,
            email: formData.email,
            gender: formData.gender,
            dob: `${formData.dobMonth}-${formData.dobDay}-${formData.dobYear}`,
            password: formData.password,
        };

        try {
            const { data } = await axiosClient.post("/register", formattedData);
            setUser(data.user);
            setToken(data.token); // Sets the token to close the modal if required in another flow
            showAlert("success", "Registration successful! Welcome aboard.");
            return true; // Indicate that the submission was successful
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                "An error occurred. Please try again.";
            showAlert("error", errorMessage); // Show error details if available
            console.error("Submission error:", err);
            return false; // Indicate that the submission failed
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecaptchaChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            isRecaptchaChecked: e.target.checked,
        }));
    };

    //SOCIAL
    const facebook = (e) => {
        //window.location.href = 'http://127.0.0.1:8000/api/facebook/';
        window.location.href = "https://test.jitume.com/api/facebook/";
    };
    const google = (e) => {
        //window.location.href = 'http://127.0.0.1:8000/api/google/';
        window.location.href = "https://test.jitume.com/api/google/";
    };
    //   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    //             <div className="bg-white max-w-full w-full h-full sm:max-w-lg sm:h-auto overflow-y-auto px-4 py-2 sm:px-6 sm:py-4 md:px-8 md:py-6 lg:px-10 lg:py-8 rounded-xl">

    return (
        <div className="h-[400px]">
            <form className="flex flex-col px-4 py-2 " onSubmit={handleSubmit}>
                {step === 1 && (
                    <div>
                        <div className="  text-center mb-4">
                            <h1 className="text-lg text-gray-700">
                                Registration
                            </h1>
                            <h2 className="text-md text-gray-700 mr-2">
                                Step 1 of 3
                            </h2>
                        </div>

                        <div className="flex my-2 overflow-y-auto gap-4">
                            <label className="text-sm text-[#666666] w-1/2">
                                First Name
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="border p-2 rounded-[12px] w-full"
                                />
                                {errors.firstName && (
                                    <p className="text-red-500 text-xs">
                                        {errors.firstName}
                                    </p>
                                )}
                            </label>
                            <label className="text-sm text-[#666666] w-1/2">
                                Middle Name
                                <input
                                    type="text"
                                    name="middleName"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                    className="border p-2 rounded-[12px] w-full"
                                />
                            </label>
                        </div>
                        <label className="text-sm text-[#666666] mt-2">
                            Last Name
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="border p-2 rounded-xl w-full"
                            />
                            {errors.lastName && (
                                <p className="text-red-500 text-xs">
                                    {errors.lastName}
                                </p>
                            )}
                        </label>
                        <label className="block py-4 text-gray-500">
                            Gender (optional)
                            <div className="flex items-center gap-3 mt-1">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={formData.gender === "female"}
                                        onChange={handleChange}
                                        className="form-radio"
                                    />
                                    <span className="ml-2 text-sm">Female</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={formData.gender === "male"}
                                        onChange={handleChange}
                                        className="form-radio"
                                    />
                                    <span className="ml-2 text-sm">Male</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="non-binary"
                                        checked={
                                            formData.gender === "non-binary"
                                        }
                                        onChange={handleChange}
                                        className="form-radio"
                                    />
                                    <span className="ml-2 text-sm">
                                        Non-Binary
                                    </span>
                                </label>
                            </div>
                        </label>
                        <label className="text-sm py-6 text-gray-500">
                            Date of Birth
                            <div className="flex space-x-2">
                                <input
                                    type="number"
                                    name="dobMonth"
                                    placeholder="Month"
                                    value={formData.dobMonth}
                                    onChange={handleChange}
                                    className="border p-2 rounded-xl w-full"
                                />
                                <input
                                    type="number"
                                    name="dobDay"
                                    placeholder="Day"
                                    value={formData.dobDay}
                                    onChange={handleChange}
                                    className="border p-2 rounded-xl w-full"
                                />
                                <input
                                    type="number"
                                    name="dobYear"
                                    placeholder="Year"
                                    value={formData.dobYear}
                                    onChange={handleChange}
                                    className="border p-2 rounded-xl w-full"
                                />
                            </div>
                            {errors.dob && (
                                <p className="text-red-500 text-xs">
                                    {errors.dob}
                                </p>
                            )}
                        </label>
                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-500">
                                or sign up with
                            </p>
                            <div className="flex justify-center mt-2 gap-4">
                                <button
                                    onClick={facebook}
                                    type="button"
                                    className="flex items-center gap-2 border text-blue-600 border-gray-300 px-4 py-2 rounded-xl"
                                >
                                    <FaFacebook className="text-blue-600" />
                                    Facebook
                                </button>
                                <button
                                    onClick={google}
                                    type="button"
                                    className="flex items-center gap-2 border text-red-500 border-gray-300 px-4 py-2 rounded-xl"
                                >
                                    <FaGoogle className="text-red-500" />
                                    Google
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <>
                        <div className="text-center mb-4">
                            <h1 className="text-lg">Registration</h1>
                            <h2 className="text-md font-semibold">
                                Step 2 of 3
                            </h2>
                        </div>
                        <label className="text-sm text-[#666666]">
                            Email
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="border p-2 rounded-xl w-full"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs">
                                    {errors.email}
                                </p>
                            )}
                        </label>
                        <label className="text-sm text-[#666666] mt-2">
                            Password
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="border p-2 rounded-xl w-full"
                                />
                                <span
                                    onClick={handleTogglePassword}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs">
                                    {errors.password}
                                </p>
                            )}
                        </label>

                        <label className="text-sm text-[#666666] mt-2">
                            Confirm Password
                            <div className="relative">
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="border p-2 rounded-xl w-full"
                                />
                                <span
                                    onClick={handleToggleConfirmPassword}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                >
                                    {showConfirmPassword ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )}
                                </span>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </label>
                        <div className="relative flex justify-between w-[260px] items-center border border-black rounded-xl p-2 mt-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    checked={formData.isRecaptchaChecked}
                                    onChange={handleRecaptchaChange}
                                />
                                <p className="text-sm text-gray-600">
                                    I'm not a robot
                                </p>
                            </div>
                            <img
                                src={googlerecaptcha}
                                alt="Google Recaptcha"
                                className="w-11 h-10"
                            />
                            {errors.recaptcha && (
                                <p className="text-red-500 text-xs absolute right-0 top-full mt-1 ml-2">
                                    {errors.recaptcha}
                                </p>
                            )}
                        </div>

                        <div className="mt-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isAgreedToTerms"
                                    className="form-checkbox"
                                    checked={formData.isAgreedToTerms}
                                    onChange={handleTermsChange}
                                />
                                <p className="text-sm text-gray-600">
                                    I have read and agree to the
                                    <a
                                        href="/terms"
                                        className="text-blue-500 hover:underline"
                                    >
                                        {" "}
                                        Terms of Use
                                    </a>{" "}
                                    and
                                    <a
                                        href="/privacy-policy"
                                        className="text-blue-500 hover:underline"
                                    >
                                        {" "}
                                        Privacy Policy
                                    </a>
                                    .
                                </p>
                            </div>
                            {errors.terms && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.terms}
                                </p>
                            )}
                        </div>
                    </>
                )}
                {step === 3 && (
                    <>
                        <div className="text-center mb-4">
                            <h1 className="text-lg">Registration</h1>
                            <h2 className="text-md font-semibold">
                                Step 3 of 3
                            </h2>
                            <StepThree />
                        </div>
                    </>
                )}
                <div className="flex gap-2">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={handlePreviousStep}
                            className="bg-gray-500 mb-8 hover:bg-gray-700 w-full text-white px-4 py-2 rounded-full flex items-center justify-center mt-5"
                        >
                            Previous
                        </button>
                    )}
                    {step < 3 && ( // Hide buttons if step is 3
                        <button
                            type="button"
                            onClick={handleNextStep}
                            className={`bg-green mb-8 hover:bg-green-700 w-full text-white px-4 py-2 rounded-full flex items-center justify-center mt-5 ${
                                isLoading ? "cursor-not-allowed" : ""
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <AiOutlineLoading3Quarters className="animate-spin" />
                            ) : step === 2 ? (
                                "Register"
                            ) : (
                                "Next"
                            )}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};
export default RegisterForm;
