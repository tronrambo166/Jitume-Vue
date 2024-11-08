import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const categories = [
    "Agriculture",
    "Renewable Energy",
    "Arts/Culture",
    "Auto",
    "Domestic (HomeHelp-etc)",
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

const ITEMS_PER_LOAD = 5;

const HorizontalInfiniteScroll = () => {
    const [visibleCategories, setVisibleCategories] = useState([]);
    const [showLeftChevron, setShowLeftChevron] = useState(false);
    const [showRightChevron, setShowRightChevron] = useState(true);
    const [hovered, setHovered] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        loadMoreCategories();
        const currentRef = containerRef.current;

        const handleScroll = () => {
            if (currentRef) {
                const { scrollLeft, scrollWidth, clientWidth } = currentRef;
                setShowLeftChevron(scrollLeft > 0);
                setShowRightChevron(scrollLeft < scrollWidth - clientWidth);
            }
        };

        currentRef.addEventListener("scroll", handleScroll);

        return () => {
            currentRef.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const loadMoreCategories = () => {
        const nextCategories = categories.slice(0, ITEMS_PER_LOAD);
        setVisibleCategories((prev) => [...prev, ...nextCategories]);
    };

    const scrollLeft = () => {
        containerRef.current.scrollBy({ left: -150, behavior: "smooth" });
    };

    const scrollRight = () => {
        containerRef.current.scrollBy({ left: 150, behavior: "smooth" });
    };

    return (
        <div
            className="relative w-full lg:w-[99%] mr-[80px] mt-3 mb-3 mx-auto"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Chevron left with smooth transition */}
            <div
                className={`absolute left-[-35px] top-1/2 transform -translate-y-1/2 transition-opacity duration-300 ${
                    showLeftChevron && hovered ? "opacity-100" : "opacity-0"
                }`}
            >
                <button
                    onClick={scrollLeft}
                    className="bg-[#0f381e] p-2 rounded-full text-white hover:bg-opacity-90 group"
                >
                    <FaChevronLeft size={18} />
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Previous
                    </span>
                </button>
            </div>

            {/* Glass effect on the left */}
            <div className="absolute left-0 top-[-10px] bottom-[-10px] w-32 bg-gradient-to-r from-[#0f381e] via-[#0f381e66] to-transparent opacity-60 rounded-lg z-10 pointer-events-none transition-opacity duration-700 ease-in-out" />

            {/* Scrollable container */}
            <div
                ref={containerRef}
                className="w-full h-10 flex items-center overflow-x-auto no-scrollbar relative"
            >
                <div className="flex items-center">
                    {visibleCategories.map((category, index) => (
                        <div
                            key={index}
                            className="category-item mx-1 text-xs sm:text-sm md:text-sm lg:text-sm border border-white rounded-full py-1 px-2 sm:py-1 sm:px-3 md:py-1.5 md:px-4 lg:py-1.5 lg:px-5 text-white cursor-pointer whitespace-nowrap transition-all ease-in-out duration-700"
                        >
                            <Link
                                to={`/category/${category
                                    .replace("/", "-")
                                    .replace(" ", "-")}`}
                            >
                                {category}
                            </Link>
                        </div>
                    ))}
                    {visibleCategories.map((category, index) => (
                        <div
                            key={`duplicate-${index}`}
                            className="category-item mx-1 text-xs sm:text-sm md:text-sm lg:text-sm border border-white rounded-full py-1 px-2 sm:py-1 sm:px-3 md:py-1.5 md:px-4 lg:py-1.5 lg:px-5 text-white cursor-pointer whitespace-nowrap transition-all ease-in-out duration-700"
                        >
                            {category}
                        </div>
                    ))}
                </div>
            </div>

            {/* Glass effect on the right */}
            <div className="absolute right-0 top-[-10px] rounded-lg bottom-[-10px] w-28 bg-gradient-to-l from-[#0f381ed3] to-transparent z-10 pointer-events-none" />

            {/* Chevron right with smooth transition */}
            <div
                className={`absolute right-[-35px] top-1/2 transform -translate-y-1/2 transition-opacity duration-300 ${
                    showRightChevron && hovered ? "opacity-100" : "opacity-0"
                }`}
            >
                <button
                    onClick={scrollRight}
                    className="bg-[#0f381e] p-2 rounded-full text-white hover:bg-opacity-90 group"
                >
                    <FaChevronRight size={18} />
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Next
                    </span>
                </button>
            </div>
        </div>
    );
};

export default HorizontalInfiniteScroll;
