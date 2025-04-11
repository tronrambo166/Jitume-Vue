import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../images/Tujitumelogo.svg";
import calendarIcon from "../../images/calendar.svg";
import addIcon from "../../images/add.png";
import chartIcon from "../../images/chart.png";
import btmIcon from "../../images/btmicon.png";
import {
    FaHome,
    FaWrench,
    FaRocket,
    FaRegCheckCircle,
    FaFileAlt,
    FaHandshake,
    FaClipboardList,
    FaCopy,
} from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { BiFolder } from "react-icons/bi";
import { BsQuestionCircle } from "react-icons/bs";
import doc from "../../images/doc.png";
import sharp from "../../images/sharp.png";
import BarIcon from "./BarIcon";
import axiosClient from "../../axiosClient";
import { AiOutlineBarChart, AiOutlineCalendar } from "react-icons/ai";
import { BiCreditCard } from "react-icons/bi";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi"; // Import icons
import { useStateContext } from "../../contexts/contextProvider";

const Sidebar = ({ onToggle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null);
    const [subId, setSubId] = useState(null);
    const { user } = useStateContext();

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
            console.log(data);
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
    const [isShrunk, setIsShrunk] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // Mobile threshold
        };

        handleResize(); // Check on initial load
        window.addEventListener("resize", handleResize); // Update on resize

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar2 = () => {
        setIsShrunk((prev) => {
            const newShrunk = !prev;
            onToggle(newShrunk); // Notify parent
            return newShrunk;
        });
    };

    return (
        <div>
            {/* FaBars Icon */}
            {!isOpen && <BarIcon toggleSidebar={toggleSidebar} />}

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`scroll-container  top-0 left-0 h-screen ${
                    isMobile
                        ? `w-64 bg-white border flex flex-col transition-transform duration-500 ease-in-out z-40 overflow-y-auto ${
                              isOpen ? "translate-x-0" : "-translate-x-full"
                          }`
                        : `bg-white border flex flex-col transition-all duration-500 ease-in-out z-40 overflow-y-auto ${
                              isShrunk ? "w-16" : "w-[250px]"
                          }`
                }`}
            >
                <div className="flex items-center justify-end">
                    {!isMobile && (
                        <>
                            {" "}
                            <button
                                onClick={toggleSidebar2}
                                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                            >
                                {isShrunk ? (
                                    <FiChevronRight />
                                ) : (
                                    <FiChevronLeft />
                                )}
                            </button>
                        </>
                    )}
                </div>
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
                                        {!isShrunk && <span>Dashboard</span>}{" "}
                                        {/* Conditionally render text */}
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
                                        <FaFileAlt
                                            className={`text-[18px] ${
                                                isActive
                                                    ? "text-white"
                                                    : "text-green"
                                            }`}
                                        />
                                        {!isShrunk && (
                                            <span>My Businesses</span>
                                        )}{" "}
                                        {/* Conditionally render text */}
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
                                end
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
                                        {!isShrunk && (
                                            <span>Business Milestones</span>
                                        )}{" "}
                                        {/* Conditionally render text */}
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
                                end
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
                                        {!isShrunk && (
                                            <span>Add Business Milestone</span>
                                        )}{" "}
                                        {/* Conditionally render text */}
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
                                end
                                onClick={() => setIsOpen(false)}
                            >
                                {({ isActive }) => (
                                    <>
                                        <FaHandshake
                                            className={`text-[18px] ${
                                                isActive
                                                    ? "text-white"
                                                    : "text-green"
                                            }`}
                                        />
                                        {!isShrunk && (
                                            <span>Business Bids</span>
                                        )}{" "}
                                        {/* Conditionally render text */}
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
                                    end
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
                                            {!isShrunk && (
                                                <span>My Services</span>
                                            )}{" "}
                                            {/* Conditionally render text */}
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
                                    end
                                    onClick={() => setIsOpen(false)}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <FaFileAlt
                                                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-green"
                                                }`}
                                            />
                                            {!isShrunk && (
                                                <span>Add Service</span>
                                            )}{" "}
                                            {/* Conditionally render text */}
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
                                    end
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
                                            {!isShrunk && (
                                                <span>Service Milestones</span>
                                            )}{" "}
                                            {/* Conditionally render text */}
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
                                    end
                                    onClick={() => setIsOpen(false)}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <FaRegCheckCircle
                                                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-green"
                                                }`}
                                            />
                                            {!isShrunk && (
                                                <span>
                                                    Add Service Milestone
                                                </span>
                                            )}{" "}
                                            {/* Conditionally render text */}
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
                                    end
                                    onClick={() => setIsOpen(false)}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <FaClipboardList
                                                className={`text-[18px] ${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-green"
                                                }`}
                                            />
                                            {!isShrunk && (
                                                <span>Service Booking</span>
                                            )}{" "}
                                            {/* Conditionally render text */}
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
                                    end
                                    onClick={() => setIsOpen(false)}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <AiOutlineCalendar
                                                className={`text-[18px] ${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-green"
                                                }`}
                                            />
                                            {!isShrunk && (
                                                <span>My Bookings</span>
                                            )}{" "}
                                            {/* Conditionally render text */}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                            {!user.investor && (
                                <li className="nav-item mb-6 rounded-xl py-2">
                                    {/* Added margin-bottom (mb-6) to move it up from the bottom */}
                                    <NavLink
                                        className={({ isActive }) =>
                                            `navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-all duration-300 ${
                                                isActive
                                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                                                    : "hover:bg-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200"
                                            }`
                                        }
                                        to="/grants-overview/grants/discover"
                                        end
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <BiSearch // Changed from BiCreditCard to BiSearch (more "exploration" themed)
                                                    className={`text-[18px] ${
                                                        isActive
                                                            ? "text-white"
                                                            : "text-green"
                                                    }`}
                                                />
                                                {!isShrunk && (
                                                    <span>Explore Grants</span>
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            )}
                            <hr />

                            {1 && (
                                <li className="nav-item mb-6 rounded-xl py-2">
                                    {/* Added margin-bottom (mb-6) to move it up from the bottom */}
                                    <NavLink
                                        className={({ isActive }) =>
                                            `navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${
                                                isActive
                                                    ? "bg-green-800 text-white"
                                                    : "hover:bg-gray-200 bg-green-500 bg-opacity-20   border-green-300"
                                            }`
                                        }
                                        to="/dashboard/my-subscription"
                                        end
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <BiCreditCard
                                                    className={`text-[18px] ${
                                                        isActive
                                                            ? "text-white"
                                                            : "text-green"
                                                    }`}
                                                />
                                                {!isShrunk && (
                                                    <span>
                                                        My Subscriptions
                                                    </span>
                                                )}{" "}
                                                {/* Conditionally render text */}
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            )}

                            {/*Don't remove it*/}
                            {subId && (
                                <button
                                    className="navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300
                                            bg-green-800 text-white"
                                    onClick={cancelSubscription}
                                >
                                    <BsQuestionCircle />
                                    <span>Cancel Subscription</span>
                                </button>
                            )}
                            {/*Don't remove it*/}

                            {/* Plz dont remove the part below  */}
                            <li className="nav-item mb-6 rounded-xl py-2">
                                <NavLink
                                    className={({ isActive }) =>
                                        `navLink flex items-center gap-4 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300`
                                    }
                                ></NavLink>
                            </li>
                        </ul>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
