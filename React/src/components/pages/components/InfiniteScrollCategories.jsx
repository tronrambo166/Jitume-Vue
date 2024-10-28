import { useState, useEffect, useRef } from "react";

const categories = [
    "Agriculture",
    "Renewable Energy",
    "Arts/Culture",
    "Auto",
    "Domestic (HomeHelp etc)",
    "Fashion",
    "Finance/Accounting",
    "Food",
    "Legal",
    "Media/Internet",
    "Pets",
    "Retail",
    "Real Estate",
    "Security",
    "Sports/Gaming",
    "Technology/Communications",
    "Other",
];

const HorizontalInfiniteScroll = () => {
    const [visibleCategories, setVisibleCategories] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        loadInitialCategories();
    }, []);

    const loadInitialCategories = () => {
        setVisibleCategories(categories);
    };

    return (
        <div className="relative w-full mt-3 mb-3 mx-auto">
            {/* Left Gradient Fade for Scroll Effect */}
            <div className="absolute left-0 top-0 bottom-0 w-12 rounded-md h-[50px] bg-gradient-to-r from-[#0f381ed6] to-[#0f381e00] z-10 pointer-events-none"></div>

            {/* Right Gradient Fade for Scroll Effect */}
            <div className="absolute right-0 top-0 bottom-0 w-12 rounded-md h-[50px] bg-gradient-to-l from-[#0f381eae] to-[#0f381e00] z-10 pointer-events-none"></div>

            {/* Scrollable Container */}
            <div
                ref={containerRef}
                className="w-full h-12 flex items-center overflow-x-auto no-scrollbar relative"
            >
                <div className="flex items-center">
                    {visibleCategories.map((category, index) => (
                        <div
                            key={index}
                            className="category-item mx-2 text-sm border border-white rounded-full py-2 px-4 text-white cursor-pointer whitespace-nowrap transition-all ease-in-out duration-700 flex items-center justify-center"
                        >
                            {category}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HorizontalInfiniteScroll;
