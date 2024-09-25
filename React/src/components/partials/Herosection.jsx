import React, { useState } from "react";
import heroimg from "../../images/heroimg.png";
import leftArrow from "../../images/left vector.png";
import rightArrow from "../../images/right vector.png";
import Modal from "./Authmodal"; // Ensure correct import

const Herosection = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleOpenAuthModal = () => {
        console.log("Opening modal..."); // Debugging
        setIsAuthModalOpen(true);
    };

    const handleCloseAuthModal = () => {
        console.log("Closing modal..."); // Debugging
        setIsAuthModalOpen(false);
    };

    return (
        <div className="bg-white relative mt-7 lg:mt-10">
            <img
                src={leftArrow}
                alt="Left Arrow"
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 h-[60px] lg:h-[100px] w-auto"
            />
            <img
                src={rightArrow}
                alt="Right Arrow"
                className="absolute right-0 top-1/3 transform -translate-y-1/2 z-10 h-[60px] lg:h-[100px] w-auto"
            />

            <div className="flex w-[82%] mx-auto flex-wrap justify-center items-center px-4 gap-[15px] py-2 sm:px-6 sm:py-3">
                <div className="flex py-2 sm:px-6 ml-8 sm:py-3 flex-col gap-6 lg:w-[345px]">
                    <h1 className="text-2xl lg:text-[22px] leading-8 text-black font-bold">
                        Empowering Businesses
                        <br /> Delivering Solutions
                        <br /> Driving Change
                    </h1>
                    <h2 className="text-lg lg:text-md text-[#0A0A0A] font-semibold">
                        Invest in a business you believe in
                        <br /> with as little as $100
                    </h2>
                    <button
                        onClick={handleOpenAuthModal}
                        className="btn-primary font-semibold w-full max-w-[125px] h-[50px] whitespace-nowrap rounded-2xl mx-auto lg:mx-0"
                    >
                        Join today
                    </button>
                </div>
                <img
                    src={heroimg}
                    alt="hero-image"
                    className="w-[380px] ml-[40px] h-auto"
                />
            </div>

            {isAuthModalOpen && (
                <Modal
                    isOpen={isAuthModalOpen}
                    onClose={handleCloseAuthModal}
                />
            )}
        </div>
    );
};

export default Herosection;
