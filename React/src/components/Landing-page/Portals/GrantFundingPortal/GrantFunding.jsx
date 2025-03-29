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
<<<<<<< HEAD
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
=======
        <div className="flex min-h-screen">
            {/* Left side - Image (fixed, exactly half screen) */}
            <ImageSection />

            {/* Right side - Form (scrollable, exactly half screen) */}
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
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
