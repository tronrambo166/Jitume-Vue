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
        <div className="flex min-h-screen">
            <ImageSection />

            <div className="w-full md:w-1/2 p-8 bg-white overflow-y-auto h-screen flex flex-col">
                <div>
                    <BackBtn />
                </div>

                <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center py-8">
                    {showSignUp ? (
                        <GrantProviderRegistration
                            handleBackToLogin={handleBackToLogin}
                        />
                    ) : (
                        <GrantSeekerLogin
                            onRegisterClick={handleRegisterClick}
                            showSignUp={false}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default GrantFunding;
