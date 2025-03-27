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
            </div>
        </div>
    );
};

export default InvestmentCapital;
