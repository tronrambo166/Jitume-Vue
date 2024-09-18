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
        <div className="bg-white relative mt-10 lg:mt-20">
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

            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-16 text-center lg:text-left mx-auto w-full lg:w-[900px] h-auto lg:h-[406px] my-0 px-4 lg:px-0">
                <div className="flex flex-col gap-6 lg:w-1/3">
                    <h2 className="text-lg lg:text-md font-semibold text-[#0A0A0A]/60">
                        Welcome to Jitume
                    </h2>
                    <h1 className="text-2xl lg:text-3xl text-black font-bold">
                        Real businesses, real <br className="hidden lg:block" />{" "}
                        solutions,
                        <span className="text-green-500 font-bold">
                            {" "}
                            real change
                        </span>
                    </h1>
                    <h2 className="text-lg lg:text-md text-[#0A0A0A] font-semibold">
                        Invest in a business you believe in with{" "}
                        <br className="hidden lg:block" /> as little as $100
                    </h2>
                    <button
                        onClick={handleOpenAuthModal}
                        className="btn-primary font-semibold w-full max-w-[125px] h-[50px] whitespace-nowrap rounded-2xl mx-auto lg:mx-0"
                    >
                        Join today
                    </button>
                </div>
                <div className="flex-1 lg:pl-12">
                    <img
                        src={heroimg}
                        alt="hero-image"
                        className="w-full h-auto"
                    />
                </div>
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
