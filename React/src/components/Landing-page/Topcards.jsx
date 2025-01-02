import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Frame1 from "../../images/Frame1.png";
import Frame2 from "../../images/Frame 2.png";
import Frame3 from "../../images/Frame 3.png";

const TopCards = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook

    const cards = [
        {
            id: 1,
            title: "Explore Agriculture",
            image: Frame1,
            category: "agriculture", // Add category name for navigation
        },
        {
            id: 2,
            title: "Discover Renewable Energy",
            image: Frame2,
            category: "renewable-energy", // Add category name for navigation
        },
        {
            id: 3,
            title: "Delve Into Tech",
            image: Frame3,
            category: "technology-communications", // Add category name for navigation
        },
    ];

    const handleCardClick = (category) => {
        navigate(`/category/${category}`); // Navigate to the category page
    };

    return (
        <div className="container mx-auto lg:px-0 sm:px-7 md:px-4 mt-8">
            <div className="flex mx-6 flex-col sm:flex-row justify-center sm:space-x-8 space-y-6 sm:space-y-0">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className="rounded-lg shadow-lg w-[90%] sm:w-[380px] mx-auto sm:mx-0 relative hover:shadow-xl transition duration-300 cursor-pointer" // Added cursor-pointer
                        onClick={() => handleCardClick(card.category)} // Add onClick handler
                    >
                        <img
                            src={card.image}
                            alt={card.title}
                            className="w-full h-60 object-cover rounded-lg transition-transform duration-300 transform hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center">
                            <p className="text-white text-lg font-semibold">
                                {card.title}
                            </p>
                            <span className="flex items-center justify-center font-thin w-10 h-10 bg-white rounded-full transition-transform duration-300 transform hover:scale-125">
                                <FaArrowRight className="h-6 w-6 text-gray-800 transition-transform duration-300 transform hover:scale-125" />
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default TopCards;
