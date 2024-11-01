import React from 'react';
import Navbar from "../Landing-page/Navbar";
import overlayImage from "../../images/overlay.png"; // Adjust the path to your image
import { Link } from "react-router-dom";
import { FaArrowRight, FaChevronRight } from "react-icons/fa"; // Import the arrow icon

const ServiceHero = () => {
    return (
        <div className="bg-[#00290F] w-full text-white min-h-[60vh] relative">
            <div className="relative z-20">
                <Navbar />
            </div>
            <div className="p-4 my-[60px] flex justify-center gap-4 flex-col items-center relative z-30">
                <h2 className="mt-4 text-5xl font-semibold">Milestones</h2>
                <div className="flex jakarta font-regular items-center gap-2 text-[15px] font-medium">
                    <Link to="/">
                        <p>Home</p>
                    </Link>
                    <FaChevronRight className="text-white text-[13px]" />{" "}
                    {/* Arrow icon */}
                    <Link to="/business-details">
                        <p>Service Details</p>
                    </Link>
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