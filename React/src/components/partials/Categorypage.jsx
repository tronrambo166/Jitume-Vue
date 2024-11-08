import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import SearchCategory from "./SearchCategory";
import CategorySlider from "./CategorySlider";
const CategoryPage = ({ categoryName }) => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const { name } = useParams();

    useEffect(() => {
        // Simulate fetching data
        setTimeout(() => {
            const testData = [
                {
                    id: 1,
                    name: "Business 1",
                    image: "https://via.placeholder.com/300",
                    contact: "123-456-7890",
                },

                // Add more listings as needed
            ];

            if (testData.length === 0) {
                setNotificationMessage("Listings not found.");
                setShowNotification(true);
            } else {
                setCards(testData);
                setLoading(false);
            }
        }, 1000); // Simulate network delay
    }, []);

    const handleCloseNotification = () => {
        setShowNotification(false);
    };

    useEffect(() => {
        const categoryResults = () => {
            axiosClient
                .get("/categoryResults/" + name)
                .then(({ data }) => {
                    setCards(data.data);
                    //res = data.data;
                    console.log(data);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        categoryResults();
    }, []);

    return (
        <div className="p-6 max-w-screen-xl mx-auto">
            <h1 className="text-4xl md:text-6xl mb-6 md:mb-10 font-bold leading-tight text-center font-sharp-grotesk text-[#00290F]">
                What Are You Looking For?
            </h1>
            <div className="w-full mb-6 mx-auto max-w-[84vw]">
                <SearchCategory />
            </div>
            <div>
                <CategorySlider />
            </div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Category: {name}</h1>
                {showNotification && (
                    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">
                        <div className="flex items-center justify-between">
                            <p>{notificationMessage}</p>
                            <button
                                onClick={handleCloseNotification}
                                className="ml-4 text-white font-bold"
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array(4)
                        .fill()
                        .map((_, index) => (
                            <div
                                key={index}
                                className="bg-gray-200 rounded-2xl w-full overflow-hidden animate-pulse"
                            >
                                <div className="w-full h-40 sm:h-48 bg-gray-300"></div>

                                <div className="p-3 sm:p-4 space-y-4">
                                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>

                                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>

                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>

                                    <div className="h-4 bg-gray-300 rounded w-full"></div>

                                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>

                                    <div className="h-4 bg-gray-300 rounded w-2/4"></div>
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {cards.length === 0 ? (
                        <p className="text-center text-gray-500 col-span-full">
                            No listings available.
                        </p>
                    ) : (
                        cards.map((card) => (
                            <Link
                                to={`/listing/${btoa(btoa(card.id))}`}
                                key={card.id}
                                className="flex-shrink-0 w-[260px] sm:w-[320px] md:w-[350px] lg:w-[390px] bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 flex flex-col justify-between  overflow-hidden "
                            >
                                <img
                                    src={"../" + card.image}
                                    alt={card.name}
                                    className="w-full h-40 sm:h-48 object-cover rounded-lg"
                                />
                                <p className="text-sm sm:text-base mt-2 mb-2 font-semibold text-[#1E293B]">
                                    #Motorcycle Transport #Bikes
                                </p>
                                <div className="mt-3 flex-grow">
                                    <h2 className="text-lg sm:text-xl mt-1 text-slate-800 font-semibold">
                                        {card.name}
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-500">
                                        {card.contact ||
                                            "Contact not available"}
                                    </p>
                                    <p className="text-sm sm:text-base text-gray-500">
                                        {card.location ||
                                            "Location not available"}
                                    </p>
                                    <p className="text-sm sm:text-base text-gray-600 mt-2">
                                        Lorem ipsum dolor sit amet consectetur.
                                        Eu quis vel pellentesque ullamcorper
                                        donec lorem auctor egestas adipiscing.
                                    </p>
                                    <p className="text-black space-x-2 font-semibold mt-2">
                                        <span className="text-[#15803D]">
                                            {" "}
                                            $5000
                                        </span>
                                        <span className="text-[#1E293B] jakarta">
                                            Amount Requested:
                                        </span>
                                    </p>
                                </div>
                                {/* <div className="mt-4 flex items-center justify-between text-blue-600">
                                  <span className="font-bold">Learn More</span>
                                  <FaChevronRight size={15} />
                              </div> */}
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
export default CategoryPage;
