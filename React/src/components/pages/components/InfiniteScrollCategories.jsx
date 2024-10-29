import { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Chevron icon import

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

const ITEMS_PER_LOAD = 5;

const HorizontalInfiniteScroll = () => {
    const [visibleCategories, setVisibleCategories] = useState([]);
    const [showLeftChevron, setShowLeftChevron] = useState(false);
    const [showRightChevron, setShowRightChevron] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        loadMoreCategories();
        const currentRef = containerRef.current;

        const handleScroll = () => {
            if (currentRef) {
                const { scrollLeft, scrollWidth, clientWidth } = currentRef;

                // Show/hide left chevron
                setShowLeftChevron(scrollLeft > 0);
                // Show/hide right chevron
                setShowRightChevron(scrollLeft < scrollWidth - clientWidth);
            }
        };

        currentRef.addEventListener("scroll", handleScroll);

        // Clean up event listener on unmount
        return () => {
            currentRef.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const loadMoreCategories = () => {
        const nextCategories = categories.slice(0, ITEMS_PER_LOAD);
        setVisibleCategories((prev) => [...prev, ...nextCategories]);
    };

    const scrollLeft = () => {
        containerRef.current.scrollBy({
            left: -200, // Adjust this value if needed
            behavior: "smooth",
        });
    };

    const scrollRight = () => {
        containerRef.current.scrollBy({
            left: 200, // Adjust this value if needed
            behavior: "smooth",
        });
    };

    return (
        <div className="relative w-full lg:w-[98%] ml-1 mt-3 mb-3 mx-auto">
            {" "}
            {/* Adjusted width here */}
            {/* Glass effect on the left with translucent middle and fading edges */}
            <div className="absolute left-0 rounded-sm top-0 bottom-0 w-32 bg-gradient-to-r from-[#0f381e] to-transparent z-10 pointer-events-none" />
            {/* Chevron left (desktop only) */}
            {showLeftChevron && (
                <button
                    onClick={scrollLeft}
                    className="hidden lg:flex absolute left-[-30px] top-1/2 transform -translate-y-1/2 z-20 bg-[#0f381e] p-2 rounded-full text-white hover:bg-opacity-90 group"
                >
                    <FaChevronLeft size={16} />
                    <span className="absolute top-full left-[80%] transform -translate-x-1/2 mt-1 text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Previous
                    </span>
                </button>
            )}
            {/* Scrollable container */}
            <div
                ref={containerRef}
                className="w-full h-12 flex items-center overflow-x-auto no-scrollbar relative"
            >
                <div className="flex items-center">
                    {visibleCategories.map((category, index) => (
                        <div
                            key={index}
                            className="category-item mx-2 text-xs sm:text-sm md:text-base lg:text-base border border-white rounded-full py-1 px-3 sm:py-1.5 sm:px-4 md:py-2 md:px-5 lg:py-2 lg:px-6 text-white cursor-pointer whitespace-nowrap transition-all ease-in-out duration-700"
                        >
                            {category}
                        </div>
                    ))}
                    {visibleCategories.map((category, index) => (
                        <div
                            key={`duplicate-${index}`}
                            className="category-item mx-2 text-xs sm:text-sm md:text-base lg:text-base border border-white rounded-full py-1 px-3 sm:py-1.5 sm:px-4 md:py-2 md:px-5 lg:py-2 lg:px-6 text-white cursor-pointer whitespace-nowrap transition-all ease-in-out duration-700"
                        >
                            {category}
                        </div>
                    ))}
                </div>
            </div>
            {/* Glass effect on the right with translucent middle and fading edges */}
            <div className="absolute right-0 top-0 rounded-sm bottom-0 w-32 bg-gradient-to-l from-[#0f381e] to-transparent z-10 pointer-events-none" />
            {/* Chevron right (desktop only) */}
            {showRightChevron && (
                <button
                    onClick={scrollRight}
                    className="hidden lg:flex absolute right-[-31px] top-1/2 transform -translate-y-1/2 z-20 bg-[#0f381e] p-2 rounded-full text-white hover:bg-opacity-90 group" // Adjusted right from -45px to -25px
                >
                    <FaChevronRight size={16} />
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Next
                    </span>
                </button>
            )}
        </div>
    );
};

export default HorizontalInfiniteScroll;
