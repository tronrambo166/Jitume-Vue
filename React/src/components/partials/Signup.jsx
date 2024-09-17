import googlerecaptcha from "../../images/googlerecaptcha.png";
import { useState, useEffect } from "react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useStateContext } from "../../contexts/contextProvider";
import axiosClient from "../../axiosClient";

const RegisterForm = () => {
    const { setUser, setToken } = useStateContext();
    const [step, setStep] = useState(1);
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
    const isValidDateOfBirth = () => {
        const { dobMonth, dobDay, dobYear } = formData;
        const month = parseInt(dobMonth, 10);
        const day = parseInt(dobDay, 10);
        const year = parseInt(dobYear, 10);

        if (isNaN(month) || isNaN(day) || isNaN(year)) {
            return false;
        }

        // Check valid year range (e.g., between 1900 and current year)
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear) {
            return false;
        }

        // Check valid month range (1-12)
        if (month < 1 || month > 12) {
            return false;
        }

        // Validate day based on month
        const daysInMonth = new Date(year, month, 0).getDate();
        if (day < 1 || day > daysInMonth) {
            return false;
        }

        return true;
    };
    const isStep1Valid = () => {
        return (
            formData.firstName && formData.lastName && isValidDateOfBirth() // Check if DOB is valid
        );
    };

    const isStep2Valid = () => {
        return (
            formData.email &&
            formData.password &&
            formData.confirmPassword &&
            formData.password === formData.confirmPassword
        );
    };

    const handleNextStep = () => {
        if (step === 1 && isStep1Valid()) {
            setStep(step + 1);
        } else if (step === 2 && isStep2Valid()) {
            handleSubmit();
        }
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        const formattedData = {
            fname: formData.firstName,
            mname: formData.middleName,
            lname: formData.lastName,
            email: formData.email,
            gender: formData.gender,
            dob: `${formData.dobMonth}-${formData.dobDay}-${formData.dobYear}`,
            password: formData.password,
        };
        console.log("Submitted Form Data:", formattedData);

        axiosClient
            .post("/register", formattedData)
            .then(({ data }) => {
                console.log(data);
                setUser(data.user);
                setToken(data.token);
            })
            .catch((err) => {
                console.log(err);
                const response = err.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
            });
    };

    return (
        <form className="flex flex-col px-4 py-4" onSubmit={handleSubmit}>
            {step === 1 && (
                <>
                    <div className="text-center mb-4">
                        <h1 className="text-lg">Registration</h1>
                        <h2 className="text-md font-semibold">Step 1 of 2</h2>
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
                    </label>
                    <label className="block mt-3 text-gray-500">
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
                                    checked={formData.gender === "non-binary"}
                                    onChange={handleChange}
                                    className="form-radio"
                                />
                                <span className="ml-2 text-sm">Non-Binary</span>
                            </label>
                        </div>
                    </label>
                    <label className="text-sm mt-4 text-gray-500">
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
                    </label>
                    <div className="flex items-center justify-center my-4">
                        <div className="border-t border-gray-300 w-1/4"></div>
                        <h2 className="mx-2">or continue with</h2>
                        <div className="border-t border-gray-300 w-1/4"></div>
                    </div>
                    <div className="flex justify-center gap-4">
                        <h1 className="text-2xl">
                            <FaGoogle />
                        </h1>
                        <h1 className="text-2xl text-blue-600">
                            <FaFacebook />
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={handleNextStep}
                        className={`bg-green hover:bg-green-700 mt-4 text-white px-4 py-2 rounded-full ${
                            !isStep1Valid() && step === 1
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }`}
                        disabled={!isStep1Valid() && step === 1}
                    >
                        Next
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <div className="py-2 flex flex-col gap-4">
                        <div className="text-center mb-4">
                            <h1 className="text-lg font-semibold">
                                Registration
                            </h1>
                            <h2 className="text-md font-semibold">
                                Step 2 of 2
                            </h2>
                        </div>
                        <label className="text-sm">
                            Email
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                            />
                        </label>
                        <label className="text-sm">
                            Password
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                            />
                        </label>
                        <label className="text-sm">
                            Confirm Password
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                            />
                        </label>
                        <p className="text-xs">
                            By creating an account, you agree to the Terms of
                            use and Privacy Policy.
                        </p>
                        <div className="flex justify-between w-[260px] items-center border border-black rounded-xl p-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    className="form-radio text-green-500"
                                />
                                <p className="text-sm">I'm not a robot</p>
                            </div>
                            <img
                                src={googlerecaptcha}
                                alt="Google Recaptcha"
                                className="w-11 h-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handlePreviousStep}
                                className="bg-gray-300 hover:bg-gray-500 w-full text-white px-4 py-2 rounded-full"
                            >
                                Previous
                            </button>

                            <button
                                type="button"
                                onClick={handleNextStep}
                                className={`bg-green hover:bg-green-700 w-full text-white px-4 py-2 rounded-full ${
                                    !isStep2Valid() && step === 2
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                                disabled={!isStep2Valid() && step === 2}
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </>
            )}
        </form>
    );
};

export default RegisterForm;
