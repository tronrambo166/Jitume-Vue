import { FaCircle } from "react-icons/fa";
import location from "../../images/location.jpeg";
import category from "../../images/category.jpeg";
import graph from "../../images/graph.jpeg";
import choose from "../../images/choose.jpeg";
import growth from "../../images/Growth.jpeg";

const HowItWorks = () => {
    const cards = [
        {
            title: "Enter Your Location",
            description:
                "Easily provide your current location to discover businesses near you. Our platform uses your location to offer the most relevant options in real-time.",
            icon: (
                <img
                    src={location}
                    alt="Location Icon"
                    className="w-full h-full object-cover rounded-full hover:animate-spin-slow"
                    loading="lazy"
                />
            ),
        },
        {
            title: "Choose a Category",
            description:
                "Select the business category that fits your needs. Whether agriculture, renewable energy or technology.",
            icon: (
                <img
                    src={category}
                    alt="Category Icon"
                    className="w-full h-full object-cover rounded-full hover:animate-spin-slow"
                    loading="lazy"
                />
            ),
        },
        {
            title: "Get Tailored Results",
            description:
                "Receive customized business recommendations based on your location and chosen category. Filter through the most relevant and high-quality options.",
            icon: (
                <img
                    src={graph}
                    alt="Graph Icon"
                    className="w-full h-full object-cover rounded-full hover:animate-spin-slow"
                    loading="lazy"
                />
            ),
        },
        {
            title: "Select Your Business",
            description:
                "Browse through the top recommendations and choose the business that meets your exact requirements, needs, quality and convenience.",
            icon: (
                <img
                    src={choose}
                    alt="Choose Icon"
                    className="w-full h-full object-cover rounded-full hover:animate-spin-slow"
                    loading="lazy"
                />
            ),
        },
        {
            title: "Grow Your Business",
            description:
                " Leverage our platform to grow your business visibility, increase traffic, and engage with investors & local customers efficiently.",
            icon: (
                <img
                    src={growth}
                    alt="Growth Icon"
                    className="w-full h-full object-cover rounded-full hover:animate-spin-slow"
                    loading="lazy"
                />
            ),
        },
    ];

    return (
        <div className="w-full bg-[#F1F7FE] px-4 pt-10 md:px-[34px] md:pt-[70px] pb-16 container mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                    <div className="flex justify-center items-center gap-1 px-6 py-2 bg-[#F8D849] rounded-full max-w-[150px] whitespace-nowrap overflow-hidden">
                        <FaCircle className="text-[6px]" />
                        <h1 className="text-[16px]">How It Works</h1>
                    </div>
                    <h1 className="text-[#334155] font-semibold leading-snug text-[28px] md:text-[50px] mt-4 md:mt-0 max-h-[8em] mx-auto">
                        Discover How It All Works
                        <br className="hidden md:block" /> With Simple Steps
                    </h1>
                </div>
                <p className="mt-4 leading-[1.6] text-[#334155] text-[14px] md:text-[18px] font-light w-full md:w-[450px] pt-2">
                    Explore the seamless process that connects you with nearby
                    businesses. Whether you're searching for services or looking
                    to grow your own, our platform simplifies the experience
                    with easy steps and personalized results.
                </p>
            </div>
            {/* Cards Section */}
            <div className="grid grid-cols-1 gap-4 mt-8 md:mt-[120px] md:grid-cols-2 lg:grid-cols-3 text-[#1E293B]">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="relative bg-white rounded-lg p-4 md:h-[240px] flex flex-col shadow-sm transform transition-transform duration-300 hover:scale-105"
                    >
                        <div className="absolute top-[-16px] left-[16px] md:top-[-20px] md:left-[25px] w-[40px] h-[40px] md:w-[50px] md:h-[50px] bg-green-200 rounded-full flex items-center justify-center overflow-hidden">
                            {card.icon}
                        </div>

                        <h2 className="text-md md:text-lg mt-8 md:mt-10 font-semibold transition-colors duration-300 hover:text-green-600">
                            {card.title}
                        </h2>
                        <p className="text-gray-600 text-[13px] md:text-[15px] py-2 md:py-3 transition-colors duration-300 hover:text-gray-800">
                            {card.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HowItWorks;
