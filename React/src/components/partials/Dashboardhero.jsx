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
import profile from "../../../images/profile.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextProvider";
import NotificationBell from "./NotificationBell";

import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import Breadcrumb from "./Breadcrumb";
import { useAlert } from "../partials/AlertContext";
import DefaultImg from "./Settings/components/DefaultImg";
import { MdDashboard } from "react-icons/md"; // A clean dashboard icon

const Dashboardhero = () => {
    const { token, setToken } = useStateContext();
    const navigate = useNavigate();
    const userImage = DefaultImg();
    const [user, setUser] = useState({});
    const [id, setId] = useState("");
    const [count, setCount] = useState("");
    const [loading, setLoading] = useState(true);
    const { showAlert } = useAlert();

    useEffect(() => {
        axiosClient
            .get("/checkAuth")
            .then(({ data }) => {
                setUser(data.user);
                setId(data.user.id);
                MessagesCount(data.user.id);
            })
            .catch(() => {
                showAlert("error", "Failed to load user data. Redirecting...");
                navigate("/");
            })
            .finally(() => setLoading(false));


    }, []);

    const MessagesCount = (id) =>{
        axiosClient
            .get("business/service_messages_count/"+id)
                .then(({ data }) => {
                    console.log('count', data);
                    setCount(data.count);
                })
    }

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
            console.log("Event listener unmounted");
        };
    }, []);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    // Get the image URL from the user object
    // const imageUrl = user?.image ? `../${user.image}` : userImage;
    // console.log("Final Image URL:", imageUrl);

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

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
            </div>
        );
    }
    let alertShown = false;

    if (!token && !alertShown) {
        showAlert("error", "You are not logged in. Please log in to continue.");
        navigate("/");
        alertShown = true;
    }

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
                                src={
                                    user?.image ? `../${user.image}` : userImage
                                }
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
                                <Link
                                    to={`./account/${id}`}
                                    className="flex items-center hover:text-green gap-1"
                                >
                                    <FaDollarSign />
                                    <span>Account</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboardhero;
