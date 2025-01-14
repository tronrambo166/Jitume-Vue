import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextProvider";
import Modal from "./Authmodal";

const ProjectManagers = () => {
    const { token, setUser, setAuth, auth } = useStateContext();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const { bid_id } = useParams();
    // Loging Details
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [id, setId] = useState("");
    const [S_id, setS_id] = useState("");

    useEffect(() => {
        if (token) {
            setIsAuthModalOpen(false);
            setModalOpen(false);
        }
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
                //setCards(testData);
                setLoading(false);
            }
        }, 1000); // Simulate network delay

        //Check Token
        // axiosClient
        //     .get("/checkAuth")
        //     .then(({ data }) => {
        //         setUser(data.user);
        //         setId(data.user.id);
        //     })
        //     .catch(console.error);
    }, []);

    const handleCloseNotification = () => {
        setShowNotification(false);
    };

    useEffect(() => {
        const ProjectManagers = () => {
            axiosClient
                .get("FindProjectManagers/" + bid_id)
                .then(({ data }) => {
                    setCards(data.services);
                    // for (const [key, value] of Object.entries(data.services)) {
                    //          setS_id(btoa(btoa(value.id) || null)
                    //      }
                    console.log(data);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        ProjectManagers();
    }, []);

    return (
        <div className="p-6 max-w-screen-xl mx-auto">
            {!token ? (
                <div className="mb-6">
                    <div className="w-75 h-100 py-5 my-5 my-auto justify-content-center my-2 text-center mx-auto">
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="btn-primary py-2 px-6 rounded-xl mt-3"
                        >
                            {" "}
                            Login To Pay{" "}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <h2 className="block my-4 font-weight-bold text-center mx-auto text-dark">
                        Find a project manager{" "}
                        <h6 class="text-center mx-auto">
                            (Within 20 miles of the Business)
                        </h6>{" "}
                    </h2>

                    {cards.length === 0 ? (
                        <p className="text-center text-gray-500 col-span-full">
                            No Manager available!
                        </p>
                    ) : (
                        cards.map((card) => (
                            <Link
                                to={`/asset-service-details/${btoa(
                                    btoa(card.id)
                                )}/${bid_id}`}
                                key={card.id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                            >
                                <img
                                    src={"../" + card.image}
                                    alt={card.name}
                                    className="w-full h-38 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold mb-1">
                                        Manager: {card.manager}{" "}
                                    </h3>
                                    <h3 className="text-xl font-semibold mb-1">
                                        service: {card.name}{" "}
                                    </h3>
                                    <p className="text-gray-700">
                                        {card.contact ||
                                            "Contact not available"}
                                    </p>
                                    <p className="text-black font-semibold mt-1">
                                        Amount: ${card.price}
                                    </p>
                                    <p className="text-black font-semibold mt-1">
                                        Location: {card.location}
                                    </p>
                                    <div className="flex items-center justify-between mt-4 text-blue-600">
                                        <span className="font-bold">
                                            Learn More
                                        </span>
                                        <FaChevronRight size={15} />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            )}
            <Modal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </div>
    );
};

export default ProjectManagers;
