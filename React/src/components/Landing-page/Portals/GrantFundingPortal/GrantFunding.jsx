import React, { useState } from "react";
import GrantSeekerLogin from "./GrantSeekerLogin";
import GrantProviderRegistration from "./GrantProviderRegistration";
import BackBtn from "../../../partials/BackBtn";
import ImageSection from "./ImageSection";

const GrantFunding = () => {
    const [showSignUp, setShowSignUp] = useState(false);

    const handleRegisterClick = () => {
        setShowSignUp(true);
    };

    const handleBackToLogin = () => {
        setShowSignUp(false);
    };

    return (
        <>
            <div className="flex flex-col md:flex-row min-h-screen">
                {/* Left side - Image (full height) */}
                <ImageSection />

                {/* Right side - Form */}
                <div className="w-full md:w-1/2 p-8 bg-white">
                    <BackBtn />

                    {showSignUp ? (
                        <div className="w-full">
                            <GrantProviderRegistration handleBackToLogin={handleBackToLogin} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <GrantSeekerLogin
                                onRegisterClick={handleRegisterClick}
                                showSignUp={false}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default GrantFunding;
