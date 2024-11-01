import Navbar from "../Landing-page/Navbar";
import overlayImage from "../../images/overlay.png";
import { Link } from "react-router-dom";
import { FaArrowRight, FaChevronRight } from "react-icons/fa";

const PaymentHero = () => {
    return (
        <div>
            <div className="bg-[#00290F] w-full text-white min-h-[60vh] relative">
                <div className="relative z-20">
                    <Navbar />
                </div>
                <div className="p-4 my-[60px] flex justify-center gap-4 flex-col items-center relative z-30">
                    <h2 className="mt-4 text-5xl font-semibold">Checkout</h2>
                    <div className="flex jakarta font-regular items-center gap-2 text-[15px] font-medium">
                        <Link to="/">
                            <p>home</p>
                        </Link>
                        <FaChevronRight className="text-white text-[13px]" />{" "}
                        {/* Arrow icon */}
                        <Link to="/">
                            <p>Business Details</p>
                        </Link>
                        <FaChevronRight className="text-white text-[13px]" />{" "}
                        {/* Arrow icon */}
                        <Link to="/">
                            <p>Checkout</p>
                        </Link>
                    </div>
                </div>
                {/* Overlay Image */}
                <div className="absolute inset-0 z-10">
                    {" "}
                    {/* Ensure the z-index is lower than the links */}
                    <img
                        src={overlayImage}
                        alt="Overlay"
                        className="w-full h-full object-cover opacity-50" // Adjust opacity as needed
                    />
                </div>
            </div>
        </div>
    );
};

export default PaymentHero;
