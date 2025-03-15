import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
const categories = [
    "Business Planning",
    "IT",
    "Legal Project Management",
    "Branding & Design",

    "Auto",
    "Finance, Accounting & Tax ",
    // "Tax Marketing",
    "Marketing",
    "Public Relations",
    "Project/Asset Management",
    "Other",
];

// Set different items per load based on screen width
const getItemsPerLoad = () => window.innerWidth;

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
        const itemsPerLoad = getItemsPerLoad();
        const nextCategories = categories.slice(0, itemsPerLoad);
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
                className={`absolute left-[-20px] lg:left-[-35px] top-1/2 transform -translate-y-1/2 transition-opacity duration-300 ${
                    showLeftChevron && hovered ? "opacity-100" : "opacity-0"
                } hidden sm:block`}
            >
                <button
                    onClick={scrollLeft}
                    className="bg-[#0f381e] p-2 rounded-full text-white hover:bg-opacity-90 group"
                >
                    <FaChevronLeft size={18} />
                </button>
            </div>

            {/* Glass effect on the left */}
            <div className="absolute left-0 top-[-10px] bottom-[-10px] w-16 sm:w-32 bg-gradient-to-r from-[#0f381e] via-[#0f381e66] to-transparent opacity-60 rounded-lg z-10 pointer-events-none transition-opacity duration-700 ease-in-out hidden sm:block" />

            {/* Scrollable container */}
            <div
                ref={containerRef}
                className="w-full h-10 flex items-center overflow-x-auto no-scrollbar relative"
            >
                <div className="flex items-center space-x-2 sm:space-x-1">
                    {visibleCategories.map((category, index) => (
                        <div
                            key={index}
                            className="category-item w-full sm:w-auto mx-1 text-xs sm:text-sm border border-white rounded-full py-1 px-2 sm:py-1 sm:px-3 md:py-1.5 md:px-4 lg:py-1.5 lg:px-5 text-white cursor-pointer whitespace-nowrap transition-all ease-in-out duration-700"
                        >
                            <Link
                                to={`/servicecategory/${category
                                    .replace(/&/g, "and") // Replace & with 'And'
                                    .replace(/[\s/]/g, "-")}`} // Replace spaces and slashes with '-'
                            >
                                {category}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Glass effect on the right */}
            <div className="absolute right-0 top-[-10px] rounded-lg bottom-[-10px] w-16 sm:w-28 bg-gradient-to-l from-[#0e310a20] to-transparent z-10 pointer-events-none hidden sm:block" />

            {/* Chevron right with smooth transition */}
            <div
                className={`absolute right-[-20px] lg:right-[-35px] top-1/2 transform -translate-y-1/2 transition-opacity duration-300 ${
                    showRightChevron && hovered ? "opacity-100" : "opacity-0"
                } hidden sm:block`}
            >
                <button
                    onClick={scrollRight}
                    className="bg-[#0f381e] p-2 rounded-full text-white hover:bg-opacity-90 group"
                >
                    <FaChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default HorizontalInfiniteScroll;
