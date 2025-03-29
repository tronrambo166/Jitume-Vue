import React from "react";
import PortalImg from "../../../../images/wwe.jpg";

const ImageSection = () => {
    return (
        <div className="hidden md:flex md:w-1/2 h-screen relative">
            <img
                src={PortalImg}
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
    );
};

export default ImageSection;
