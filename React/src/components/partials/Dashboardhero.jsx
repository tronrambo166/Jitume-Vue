import {
    FaUser,
    FaCog,
    FaEnvelope,
    FaCopy,
    FaDollarSign,
    FaHome,
    FaDoorOpen,
    FaQuestionCircle,
    FaHandHoldingUsd,
} from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
// import { MdDashboard } from "react-icons/md";
import profile from "../../images/profile.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextProvider";
import NotificationBell from "./NotificationBell";

import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import Breadcrumb from "./Breadcrumb";
import { useAlert } from "../partials/AlertContext";
import DefaultImg from "./Settings/components/DefaultImg";
import { MdDashboard } from "react-icons/md"; // A clean dashboard icon
import TujitumeLogo from "../../images/Tujitumelogo.svg";
import Modal from "./Authmodal";
const Dashboardhero = () => {
    const { token, setToken } = useStateContext();
    const navigate = useNavigate();
    const userImage = DefaultImg();
    const [user, setUser] = useState({});
    const [id, setId] = useState("");
    const [count, setCount] = useState("");
    const [loading, setLoading] = useState(true);
    const { showAlert } = useAlert();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [wasModalOpened, setWasModalOpened] = useState(false); // Track if modal was opened before closing
    const [showMore, setShowMore] = useState(false);

    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         setLoading(true);
    //         try {
    //             const { data } = await axiosClient.get("/checkAuth");
    //             setUser(data.user);
    //             setId(data.user.id);
    //         } catch (error) {
    //             if (!token) {
    //                 setIsAuthModalOpen(true);
    //                 setWasModalOpened(true);
    //                 sessionStorage.setItem("wasModalOpened", "true");
    //             }
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchUserData();
    // }, []);

    // useEffect(() => {
    //     if (!loading && !isAuthModalOpen && wasModalOpened && !token) {
    //         navigate("/");
    //         showAlert("error", "Please login to continue.");
    //     }

    //     // Ensure reload happens only once after login
    //     if (sessionStorage.getItem("wasModalOpened") === "true" && token) {
    //         sessionStorage.removeItem("wasModalOpened"); // Prevent infinite reload
    //         window.location.reload();
    //     }
    // }, [loading, isAuthModalOpen, wasModalOpened, token, navigate]);
    const dropdownRef = useRef(null);

     useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowMore(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const { data } = await axiosClient.get("/checkAuth");
                setUser(data.user);
                setId(data.user.id);

                if (data.user.investor == 3 || data.user.investor === 2) {
                    navigate("/grants-overview");
                } else {
                    navigate("/dashboard");
                }
            } catch (error) {
                if (!token) {
                    setIsAuthModalOpen(true);
                    setWasModalOpened(true);
                    localStorage.setItem("wasModalOpened", "true");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (!loading && !isAuthModalOpen && wasModalOpened && !token) {
            navigate("/");
            showAlert("error", "Please login to continue.");
        }

        // Ensure reload happens only once after login
        if (localStorage.getItem("wasModalOpened") === "true" && token) {
            localStorage.removeItem("wasModalOpened"); // Prevent infinite reload
            window.location.reload();
        }
    }, [loading, isAuthModalOpen, wasModalOpened, token, navigate]);

    const intervalRef = useRef(null);

    // useEffect(() => {
    //     if (!id) return;

    //     const fetchMessageCount = async () => {
    //         try {
    //             const { data } = await axiosClient.get(
    //                 `business/service_messages_count/${id}`
    //             );
    //             setCount(data.count);
    //         } catch (error) {
    //             console.error("Error fetching messages count:", error);
    //         }
    //     };

    //     // Fetch immediately, then start interval
    //     fetchMessageCount();

    //     // Clear any existing interval before setting a new one
    //     if (intervalRef.current) {
    //         clearInterval(intervalRef.current);
    //     }

    //     intervalRef.current = setInterval(fetchMessageCount, 2000);

    //     return () => clearInterval(intervalRef.current);
    // }, [id]);
    useEffect(() => {
        if (!id) return;

        const fetchMessageCount = async () => {
            try {
                const { data } = await axiosClient.get(
                    `business/service_messages_count/${id}`
                );
                setCount(data.count);
            } catch (error) {
                console.error("Error fetching messages count:", error);
            }
        };

        fetchMessageCount(); // Fetch once on mount
    }, [id]); // Runs only when `id` changes

    useEffect(() => {
        const handleUserUpdate = (event) => {
            const updatedData = event.detail;
            setUser((prevUser) => ({
                ...prevUser,
                ...updatedData,
            }));
            console.log("User data updated:", updatedData);
        };
        window.addEventListener("userUpdated", handleUserUpdate);
        return () => {
            window.removeEventListener("userUpdated", handleUserUpdate);
            // console.log("Event listener unmounted");
        };
    }, []);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const onLogout = (ev) => {
        ev.preventDefault();
        setLoading(true);
        axiosClient
            .get("/logout")
            .then(() => {
                setUser(null);
                setToken(null);
                showAlert("success", "Logged out successfully");
                navigate("/");
            })
            // .catch(() => {
            //     // showAlert("error", "Failed to log out. Please try again.");
            // })
            .finally(() => setLoading(false));
    };

    const account = (ev) => {
        ev.preventDefault();
        navigate("./account", {
            state: {
                user_id: id,
            },
        });
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <img
                        src={TujitumeLogo}
                        alt="Tujitume Logo"
                        className="w-32 h-auto"
                    />
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
                </div>
            </div>
        );
    }
    let alertShown = false;

    // if (!token && !alertShown) {
    //     showAlert("error", "You are not logged in. Please log in to continue.");
    //     navigate("/");
    //     alertShown = true;
    // }

    return (
        <div
            id="dashbg"
            className="relative max-w-[95%] mx-auto rounded-xl mb-[20px] h-[200px] mt-4 p-4 bg-gradient-to-r from-blue-600 to-purple-600"
        >
            <div className="flex justify-between items-center flex-wrap">
                <div className="mb-4 md:mb-0">
                    <Breadcrumb />
                    <h2 className="text-white font-semibold text-base md:text-lg">
                        Dashboard
                    </h2>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className="flex text-sm gap-1 items-center text-white hover:text-gray-200 transition-colors duration-200"
                    >
                        <FaHome />
                        <span>Home</span>
                    </Link>
                    <div>
                        {!token ? (
                            <div
                                onClick={() => navigate("/home")}
                                className="flex items-center text-sm gap-2 cursor-pointer text-white hover:text-gray-200 transition-colors duration-200"
                            >
                                <span>Sign In</span>
                                <FaDoorOpen />
                            </div>
                        ) : (
                            <div
                                onClick={onLogout}
                                className="flex items-center text-sm gap-2 cursor-pointer text-white hover:text-gray-200 transition-colors duration-200"
                            >
                                <FaUser />
                                <span>Sign Out</span>
                            </div>
                        )}
                    </div>
                    <Link
                        to="/dashboard/settings"
                        className="flex items-center space-x-2 hover:text-gray-200 transition-colors duration-200"
                    >
                        <FaCog className="text-white text-xl" />
                        <span className="text-white text-sm">Settings</span>
                    </Link>
                    <NotificationBell />
                </div>
            </div>

            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full">
                <div className="bg-white/50 dark:bg-gray-800/90  max-w-[95%] mx-auto px-4 md:px-6 py-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div className="flex gap-2 items-center">
                            <img
                                src={user?.image ? user.image : userImage}
                                className="rounded-xl w-16 h-16 md:w-20 md:h-20 object-cover border-2 border-white shadow-sm"
                                alt="Profile"
                            />
                            <div className="flex flex-col">
                                <h2 className="text-gray-900 dark:text-white text-sm md:text-lg font-bold">
                                    {user.fname} {user.lname}
                                </h2>
                                <h3 className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                                    {user.email || "test@email.com"}
                                </h3>
                            </div>
                        </div>
                        <div className="flex mt-5 text-sm md:text-[13px] gap-4 flex-wrap items-center relative">
                            <Link
                                to=""
                                className="flex items-center hover:text-green-600 dark:hover:text-green-400 gap-1 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <MdDashboard />
                                <span>Overview</span>
                            </Link>

                            <Link
                                to="/dashboard/addbusiness"
                                className="flex items-center hover:text-green-600 dark:hover:text-green-400 gap-1 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <FaCopy />
                                <span>Add Business</span>
                            </Link>

                            <Link
                                to="/dashboard/add-service"
                                className="flex items-center hover:text-green-600 dark:hover:text-green-400 gap-1 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <FaCopy />
                                <span>Add Service</span>
                            </Link>

                            <Link
                                to="/dashboard/messages"
                                className="flex items-center hover:text-green-600 dark:hover:text-green-400 gap-1 relative transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <FaEnvelope />
                                <span>Messages</span>
                                {count > 0 && (
                                    <span className="absolute top-[-8px] right-[-10px] inline-flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-500 rounded-full animate-pulse">
                                        {count}
                                    </span>
                                )}
                            </Link>

                            {/* Modernized View More Dropdown */}
                            {id && (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setShowMore(!showMore)}
                                        className="flex items-center hover:text-green-600 dark:hover:text-green-400 gap-1 transition-all duration-200 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                    >
                                        <BsChevronDown
                                            className={`transition-transform duration-200 ${
                                                showMore ? "rotate-180" : ""
                                            }`}
                                        />
                                        <span>View More</span>
                                    </button>

                                    {showMore && (
                                        <div className="absolute z-20 mt-2 right-0 bg-white dark:bg-gray-800 shadow-xl rounded-lg py-1 w-48 border border-gray-200 dark:border-gray-700 animate-fade-in">
                                            <button
                                                onClick={account}
                                                className="flex items-center w-full hover:bg-gray-100 dark:hover:bg-gray-700 gap-2 px-4 py-2 text-left transition-colors duration-150"
                                            >
                                                <FaDollarSign className="text-gray-500 dark:text-gray-400" />
                                                <span className="text-gray-700 dark:text-gray-200">
                                                    Account
                                                </span>
                                            </button>
                                            {!user?.investor && (
                                                <Link
                                                    to="/grants-overview/grants/discover"
                                                    onClick={() =>
                                                        setShowMore(false)
                                                    }
                                                    className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 gap-2 px-4 py-2 transition-colors duration-150"
                                                >
                                                    <FaHandHoldingUsd className="text-gray-500 text-lg dark:text-gray-400" />
                                                    <span className="text-gray-700 text-xs dark:text-gray-200">
                                                        Explore Grants & Capital
                                                        Investment
                                                    </span>
                                                </Link>
                                            )}
                                            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                            {user?.investor && (
                                                <Link
                                                    to="/help-center"
                                                    onClick={() =>
                                                        setShowMore(false)
                                                    }
                                                    className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 gap-2 px-4 py-2 transition-colors duration-150"
                                                >
                                                    <FaQuestionCircle className="text-gray-500 dark:text-gray-400" />
                                                    <span className="text-gray-700 dark:text-gray-200">
                                                        Support
                                                    </span>
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </div>
    );
};

export default Dashboardhero;
