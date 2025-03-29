import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import BackBtn from "../../../partials/BackBtn";
import ImageComponent from "./ImageComponent";

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
<<<<<<< HEAD
            <ImageComponent />

            <div className="w-full md:w-1/2 p-8 bg-white">
                <BackBtn />

                {showSignUp ? (
                    <div className="w-full">
                        <RegisterForm onSwitchToLogin={handleBackToLogin} />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <LoginForm
                            onSwitchToRegister={handleSwitchToRegister}
                        />
                    </div>
                )}
=======
            {/* Left Side - Fixed Image (doesn't scroll) */}
                <ImageComponent />

            {/* Right Side - Scrollable Content */}
            <div className="w-full md:w-1/2 p-8 bg-white overflow-y-auto h-screen">
                <BackBtn />

                <div className=" mx-auto ">
                    {showSignUp ? (
                        <RegisterForm onSwitchToLogin={handleBackToLogin} />
                    ) : (
                        <div className=" max-w-md mx-auto py-8 flex flex-col justify-center min-h-[calc(100vh-200px)]">
                            <LoginForm
                                onSwitchToRegister={handleSwitchToRegister}
                            />
                        </div>
                    )}
                </div>
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
            </div>
        </div>
    );
};

export default InvestmentCapital;
