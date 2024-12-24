import React from 'react';
import Navbar from "../Landing-page/Navbar";
import overlayImage from "../../images/overlay.png"; // Adjust the path to your image
import { Link } from "react-router-dom";
import { FaArrowRight, FaChevronRight } from "react-icons/fa"; // Import the arrow icon

const ServiceHero = () => {
       const handleGoBack = () => {
           navigate(-1); // Go back to the last visited page
       };
    return (
        <div className="bg-[#00290F] w-full text-white min-h-[0vh] relative">
            <div className="relative z-20">
                <Navbar />
            </div>
           <div className="pb-16 flex justify-center gap-4 flex-col items-center relative z-30">
                    <h2 className="mt-4 text-5xl font-semibold">Milestones</h2>
                <div className="flex jakarta font-regular items-center gap-2 text-[15px] font-medium">
                    <Link to="/">
                        <p>Home</p>
                    </Link>
                    {/* Arrow icon */}
                    <button
                        onClick={handleGoBack}
                        className="flex items-center gap-2 text-white text-[15px]"
                    >
                        <FaChevronRight className="text-white text-[13px]" />
                        <p>Service Details</p>
                    </button>
                    <FaChevronRight className="text-white  text-[13px]" />{" "}
                    {/* Arrow icon */}
                    <Link to="#">
                        <p> Service Milestones</p>
                    </Link>
                </div>
            </div>
            {/* Overlay Image */}
            <div className="absolute inset-0 z-10">
                <img
                    src={overlayImage}
                    alt="Overlay"
                    className="w-full h-full object-cover opacity-50" // Adjust opacity as needed
                />
            </div>
        </div>
    );
};

export default ServiceHero;