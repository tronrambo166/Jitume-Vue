import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../images/logo3.png";
import calendarIcon from "../../images/calendar.svg";
import addIcon from "../../images/add.png";
import chartIcon from "../../images/chart.png";
import btmIcon from "../../images/btmicon.png";
import { FaHome, FaWrench, FaRocket, FaRegCheckCircle } from "react-icons/fa";
import { BiFolder } from "react-icons/bi";
import { BsQuestionCircle } from "react-icons/bs";
import doc from "../../images/doc.png";
import sharp from "../../images/sharp.png";
import BarIcon from "./BarIcon";
import axiosClient from "../../axiosClient";
import { AiOutlineBarChart, AiOutlineCalendar } from "react-icons/ai";
const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null);
    const [subId, setSubId] = useState(null);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleResize = () => {
        if (window.innerWidth >= 768) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        axiosClient.get("business/getCurrSubscription/").then((data) => {
            setSubId(data.data.mySub.id);
        });
        

        handleResize();
        window.addEventListener("resize", handleResize);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


        const cancelSubscription = () => {
        try { alert('ok')
            const response = axiosClient.get(
                "business/cancelSubscription",
                subId
            );

            if (response.data.status === 200) {
                showAlert("success", response.data.message);
            } else {
                showAlert("error", response.data.message);
            }
            console.log(response);
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };


    return (
        <>
            {/* FaBars Icon */}
            {!isOpen && <BarIcon toggleSidebar={toggleSidebar} />}

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`scroll-container fixed top-0 left-0 h-screen w-64 bg-white border flex flex-col transition-transform duration-300 z-40 overflow-y-auto
                    ${
                        isOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <Link className="flex items-center" to="/">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-[120px] transition-transform duration-300"
                        />
                    </Link>
                </div>

                {/* Sidebar Links */}
                <div>
                    <ul className="space-y-2">
                        <li className="nav-item py-2">
                            <NavLink
                                className={({ isActive }) =>
                                    `navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${
                                        isActive
                                            ? "bg-green-800 text-white"
                                            : "hover:bg-gray-200 text-gray-400"
                                    }`
                                }
                                to="/dashboard"
                                end
                                onClick={() => setIsOpen(false)}
                            >
                                {({ isActive }) => (
                                    <>
                                        <FaHome
                                            className={`text-[18px] ${
                                                isActive
                                                    ? "text-white"
                                                    : "text-green"
                                            }`}
                                        />
                                        <span>Dashboard</span>
                                    </>
                                )}
                            </NavLink>
                        </li>

                        <li className="nav-item py-2">
                            <NavLink
                                className={({ isActive }) =>
                                    `navLink flex items-center gap-3 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${
                                        isActive
                                            ? "bg-green-800 text-white"
                                            : "hover:bg-gray-200 text-gray-400"
                                    }`
                                }
                                to="/dashboard/my-businesses"
                                end
                                onClick={() => setIsOpen(false)}
                            >
                                {({ isActive }) => (
                                    <>
                                        <BiFolder
                                            className={`text-[18px] ${
                                                isActive
                                                    ? "text-white"
                                                    : "text-green"
                                            }`}
                                        />
                                        <span>My Businesses</span>
                                    </>
                                )}
                            </NavLink>
                        </li>

                        <li className="nav-item py-2">
                            <NavLink
                                className={({ isActive }) =>
                                    `navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${
                                        isActive
                                            ? "bg-green-800 text-white"
                                            : "hover:bg-gray-200 text-gray-400"
                                    }`
                                }
                                to="/dashboard/milestones"
                                end // Ensures exact match
                                onClick={() => setIsOpen(false)}
                            >
                                {({ isActive }) => (
                                    <>
                                        <FaRocket
                                            className={`text-[18px] ${
                                                isActive
                                                    ? "text-white"
                                                    : "text-green"
                                            }`}
                                        />
                                        <span>Milestones</span>
                                    </>
                                )}
                            </NavLink>
                        </li>

                        <li className="nav-item py-2">
                            <NavLink
                                className={({ isActive }) =>
                                    `navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${
                                        isActive
                                            ? "bg-green-800 text-white"
                                            : "hover:bg-gray-200 text-gray-400"
                                    }`
                                }
                                to="/dashboard/add-milestone"
                                end // Ensures exact match
                                onClick={() => setIsOpen(false)}
                            >
                                {({ isActive }) => (
                                    <>
                                        <FaRegCheckCircle
                                            className={`text-[18px] ${
                                                isActive
                                                    ? "text-white"
                                                    : "text-green"
                                            }`}
                                        />
                                        <span>Add Business Milestone</span>
                                    </>
                                )}
                            </NavLink>
                        </li>

                        <li className="nav-item py-2">
                            <NavLink
                                className={({ isActive }) =>
                                    `navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${
                                        isActive
                                            ? "bg-green-800 text-white"
                                            : "hover:bg-gray-200 text-gray-400"
                                    }`
                                }
                                to="/dashboard/investment-bids"
                                end // Ensures exact match
                                onClick={() => setIsOpen(false)}
                            >
                                {({ isActive }) => (
                                    <>
                                        <AiOutlineBarChart
                                            className={`text-[18px] ${
                                                isActive
                                                    ? "text-white"
                                                    : "text-green"
                                            }`}
                                        />
                                        <span>Business Bids</span>
                                    </>
                                )}
                            </NavLink>
                        </li>

                        <hr />

                        {/* Additional Links */}
                        <ul className="space-y-2 mt-6">
                            <li className="nav-item py-2">
                                <NavLink
                                    className={({ isActive }) =>
                                        `navLink flex items-center gap-3 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${
                                            isActive
                                                ? "bg-green-800 text-white"
                                                : "hover:bg-gray-200 text-gray-400"
                                        }`
                                    }
                                    to="/dashboard/services-table"
                                    end // Ensures exact match
                                    onClick={() => setIsOpen(false)}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <FaWrench
                                                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-green"
                                                }`}
                                            />
                                            <span>My Services</span>
                                        </>
                                    )}
                                </NavLink>
                            </li>

                            <li className="nav-item py-2">
                                <NavLink
                                    className={({ isActive }) =>
                                        `navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${
                                            isActive
                                                ? "bg-green-800 text-white"
                                                : "hover:bg-gray-200 text-gray-400"
                                        }`
                                    }
                                    to="/dashboard/add-service"
                                    end // Ensures exact match
                                    onClick={() => setIsOpen(false)}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <AiOutlineCalendar
                                                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-green"
                                                }`}
                                            />
                                            <span>Add Service</span>
                                        </>
                                    )}
                                </NavLink>
                            </li>

                            <li className="nav-item py-2">
                                <NavLink
                                    className={({ isActive }) =>
                                        `navLink flex items-center gap-3 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${
                                            isActive
                                                ? "bg-green-800 text-white"
                                                : "hover:bg-gray-200 text-gray-400"
                                        }`
                                    }
                                    to="/dashboard/service-milestone"
                                    end // Ensures exact match
                                    onClick={() => setIsOpen(false)}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <FaRegCheckCircle
                                                className={`text-[18px] ${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-green"
                                                }`}
                                            />
                                            <span>Milestone</span>
                                        </>
                                    )}
                                </NavLink>
                            </li>

                            <li className="nav-item py-2">
                                <NavLink
                                    className={({ isActive }) =>
                                        `navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${
                                            isActive
                                                ? "bg-green-800 text-white"
                                                : "hover:bg-gray-200 text-gray-400"
                                        }`
                                    }
                                    to="/dashboard/addservicemilestone"
                                    end // Ensures exact match
                                    onClick={() => setIsOpen(false)}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <AiOutlineCalendar
                                                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-green"
                                                }`}
                                            />
                                            <span>Add Service Milestone</span>
                                        </>
                                    )}
                                </NavLink>
                            </li>

                            <li className="nav-item py-2">
                                <NavLink
                                    className={({ isActive }) =>
                                        `navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${
                                            isActive
                                                ? "bg-green-800 text-white"
                                                : "hover:bg-gray-200 text-gray-400"
                                        }`
                                    }
                                    to="/dashboard/service-bookings"
                                    end // Ensures exact match
                                    onClick={() => setIsOpen(false)}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <AiOutlineBarChart
                                                className={`text-[18px] ${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-green"
                                                }`}
                                            />
                                            <span>Service Booking</span>
                                        </>
                                    )}
                                </NavLink>
                            </li>

                            <li className="nav-item mb-6 rounded-xl py-2">
                                {/* Added margin-bottom (mb-6) to move it up from the bottom */}
                                <NavLink
                                    className={({ isActive }) =>
                                        `navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${
                                            isActive
                                                ? "bg-green-800 text-white"
                                                : "hover:bg-gray-200 text-gray-400"
                                        }`
                                    }
                                    to="/dashboard/mybookings"
                                    end // Ensures exact match
                                    onClick={() => setIsOpen(false)}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <BsQuestionCircle
                                                className={`text-[18px] ${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-green"
                                                }`}
                                            />
                                            <span>My Bookings</span>
                                        </>
                                    )}
                                </NavLink>
                            </li>

                                <li className="nav-item mb-6 rounded-xl py-2">
                                {/* Added margin-bottom (mb-6) to move it up from the bottom */}
                                <NavLink
                                    className={({ isActive }) =>
                                        `navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${
                                            isActive
                                                ? "bg-green-800 text-white"
                                                : "hover:bg-gray-200 text-gray-400"
                                        }`
                                    }
                                    
                                    onClick={() => cancelSubscription}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <BsQuestionCircle
                                                className={`text-[18px] ${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-green"
                                                }`}
                                            />
                                            <span>Cancel Subscription</span>
                                        </>
                                    )}
                                </NavLink>
                            </li>


                            {/* Plz dont remove the part below  */}
                            <li className="nav-item mb-6 rounded-xl py-2">
                                <NavLink
                                    className={({ isActive }) =>
                                        `navLink flex items-center gap-4  px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 `
                                    }
                                ></NavLink>
                            </li>
                        </ul>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
