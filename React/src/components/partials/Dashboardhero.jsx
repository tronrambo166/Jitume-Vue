import {
    FaUser,
    FaCog,
    FaWrench,
    FaEnvelope,
    FaCopy,
    FaDollarSign,
    FaHome,
    FaDoorOpen,
    FaBars,
} from "react-icons/fa";
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

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const { data } = await axiosClient.get("/checkAuth");
                setUser(data.user);
                setId(data.user.id);
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
                user_id: id
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
            className="relative max-w-[95%] mx-auto rounded-xl mb-[20px] h-[200px] mt-4 p-4"
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
                        className="flex text-sm gap-1 items-center text-white"
                    >
                        <FaHome />
                        <span>Home</span>
                    </Link>
                    <div>
                        {!token ? (
                            <div
                                onClick={() => navigate("/home")} // Adjust navigation logic as needed
                                className="flex items-center text-sm gap-2 cursor-pointer text-white"
                            >
                                <span>Sign In</span>
                                <FaDoorOpen /> {/* Use the door icon here */}
                            </div>
                        ) : (
                            <div
                                onClick={onLogout}
                                className="flex items-center text-sm gap-2 cursor-pointer text-white"
                            >
                                <FaUser />
                                <span>Sign Out</span>
                            </div>
                        )}
                    </div>
                    <Link
                        to="/dashboard/settings"
                        className="flex items-center space-x-2 hover:text-gray"
                    >
                        <FaCog className="text-white text-xl" />
                        <span className="text-white text-sm">Settings</span>
                    </Link>
                    <NotificationBell />
                </div>
            </div>

            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full">
                <div className="bg-gray-100/50 max-w-[95%] mx-auto px-4 md:px-6 py-3 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div className="flex gap-2 items-center">
                            <img
                                src={user?.image ? user.image : userImage}
                                className="rounded-xl w-16 h-16 md:w-20 md:h-20"
                                alt="Profile"
                            />
                            <div className="flex flex-col">
                                <h2 className="text-black text-sm md:text-lg font-bold">
                                    {user.fname} {user.lname}
                                </h2>
                                <h3 className="text-sm md:text-base">
                                    {user.email || "test@email.com"}
                                </h3>
                            </div>
                        </div>
                        <div className="flex mt-5 text-sm md:text-[13px] gap-4 flex-wrap items-center">
                            <Link
                                to=""
                                className="flex items-center hover:text-green gap-1"
                            >
                                <MdDashboard />
                                <span>Overview</span>
                            </Link>
                            <Link
                                to="/dashboard/addbusiness"
                                className="flex items-center hover:text-green gap-1"
                            >
                                <FaCopy />
                                <span>Add Business</span>
                            </Link>
                            <Link
                                to="/dashboard/add-service"
                                className="flex items-center hover:text-green gap-1"
                            >
                                <FaCopy />
                                <span>Add Service</span>
                            </Link>
                            <Link
                                to="/dashboard/messages"
                                className="flex items-center hover:text-green gap-1"
                            >
                                <div className="relative flex items-center gap-1 hover:text-green">
                                    <FaEnvelope />
                                    <span>Messages</span>
                                    {count > 0 && (
                                        <span className="absolute top-[-8px] right-[-10px] inline-flex items-center justify-center w-3 h-3 text-xs font-semibold text-green-200 bg-red-600 rounded-full pulse">
                                            {count}
                                        </span>
                                    )}
                                </div>
                            </Link>

                            {id && (
                                <button
                                    onClick={account}
                                    className="flex items-center hover:text-green gap-1"
                                >
                                    <FaDollarSign />
                                    <span>Account</span>
                                </button>
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
