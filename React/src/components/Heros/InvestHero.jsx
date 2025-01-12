import Navbar from "../Landing-page/Navbar";
import overlayImage from "../../images/overlay.webp"; // Adjust the path to your image
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaChevronRight } from "react-icons/fa"; // Import the arrow icon

const InvestHero = () => {
    const navigate = useNavigate(); // Hook to navigate programmatically

    const handleGoBack = () => {
        navigate(-1); // Go back to the last visited page
    };

    return (
        <div className="bg-[#00290F] w-full text-white min-h-[0vh] relative">
            <div className="relative z-20">
                <Navbar />
            </div>
            <div className="pb-16 flex justify-center gap-4 flex-col items-center relative z-30 px-4 sm:px-8">
                <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold text-center">
                    Invest with Equipment
                </h2>
                <div className="flex flex-wrap jakarta font-regular items-center gap-2 text-sm sm:text-base font-medium justify-center mt-4">
                    <Link to="/" className="text-sm sm:text-base">
                        <p>Home</p>
                    </Link>
                    {/* Arrow icon */}
                    <button
                        onClick={handleGoBack}
                        className="flex items-center gap-2 text-white text-sm sm:text-base"
                    >
                        <FaChevronRight className="text-white text-[13px] sm:text-[15px]" />
                        <p>Business Details</p>
                    </button>
                    <FaChevronRight className="text-white text-[13px] sm:text-[15px]" />{" "}
                    {/* Arrow icon */}
                    <Link to="#" className="text-sm sm:text-base">
                        <p>Invest with Equipment</p>
                    </Link>
                </div>
            </div>
            {/* Overlay Image */}
            <div className="absolute inset-0 z-10">
                <img
                    src={overlayImage}
                    alt="Overlay"
                    className="w-full h-full object-cover opacity-50"
                />
            </div>
        </div>
    );
};

export default InvestHero;
