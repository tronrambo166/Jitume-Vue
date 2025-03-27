import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import BackBtn from "../../../partials/BackBtn";

const InvestmentCapital = () => {
    const [showSignUp, setShowSignUp] = useState(false);

    const handleBackToLogin = () => {
        setShowSignUp(false);
    };

    const handleSwitchToRegister = () => {
        setShowSignUp(true);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="hidden md:flex md:w-1/2 h-screen relative">
                <img
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Investment capital"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>

                <div className="relative z-10 flex flex-col items-center justify-center text-white text-center w-full p-8">
                    <h3 className="text-3xl font-bold">
                        Global Investment Platform
                    </h3>
                    <p className="mt-2 text-lg">
                        Connect with entrepreneurs and investment opportunities
                        worldwide.
                    </p>
                </div>
            </div>

            <div className="w-full md:w-1/2 p-8 bg-white">
                <BackBtn />

                {showSignUp ? (
                    <div className="w-full">
                        {/* <button
                            onClick={handleBackToLogin}
                            className="mb-4 flex items-center gap-2 text-green-600 hover:text-green-500 mt-6"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Back to Login
                        </button> */}
                            <RegisterForm onSwitchToLogin={handleBackToLogin} />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <LoginForm
                            onSwitchToRegister={handleSwitchToRegister}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvestmentCapital;
