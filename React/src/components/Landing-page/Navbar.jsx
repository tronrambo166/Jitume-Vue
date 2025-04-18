import { useState, useEffect, useRef } from "react";
import {
    AiOutlineDown,
    AiOutlineUp,
    AiOutlineMenu,
    AiOutlineClose,
} from "react-icons/ai";
import down from "../../images/down.png";
// import { useLocation } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import logo from "../../images/TujitumeLogo-white.svg";
import Modal from "../partials/Authmodal";
import CreateInvAccountModal from "../partials/CreateInvAccount";
import { useStateContext } from "../../contexts/contextProvider";
import axiosClient from "../../axiosClient";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import CreateInvestorAccount from "../partials/CreateInvAccount";
import { useAlert } from "../partials/AlertContext";

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCreateInvModalOpen, setIsCreateInvModalOpen] = useState(false);
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert
    const [isDropdown, setIsDropdown] = useState(false);

    const dropdownTimeoutRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false); // Close mobile menu on resize
                setIsDropdownOpen(false); // Close dropdown on resize
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const useClickOutside = (ref, callback) => {
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    callback();
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref, callback]);
    };

    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useClickOutside(dropdownRef, () => {
        setIsDropdown(false);
    });

    const { user, token, setUser, setToken } = useStateContext();
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const onLogout = (ev) => {
        ev.preventDefault();
        axiosClient.get("/logout").then(({}) => {
            setUser(null);
            setToken(null);
        });
    };
    const location = useLocation();

    // Check if we're on the service page
    const isServicePage = location.pathname === "/services"; // Adjust this path to match your service page

    // Handle hover in (opens dropdown immediately)
    const handleMouseEnter = () => {
        clearTimeout(dropdownTimeoutRef.current); // Clear any existing timeout
        setIsDropdownOpen(true); // Open the dropdown immediately
    };

    // Handle hover out (closes dropdown after a delay)
    const handleMouseLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => {
            setIsDropdownOpen(false); // Close the dropdown after 300ms
        }, 400); // Adjust the delay as necessary
    };

    const toggleDropdown = () => {
        clearTimeout(dropdownTimeoutRef.current); // Clear the timeout to avoid interference with the click
        setIsDropdownOpen((prev) => !prev);
    };

    return (
        <div
            className={`py-3 px-[35px] text-white ${
                isServicePage ? "service-navbar" : ""
            }`}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                    <Link
                        to="/"
                        className="hover:opacity-75 transition-opacity"
                    >
                        <span>
                            <img src={logo} width={130} alt="Logo" />
                        </span>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-white"
                    >
                        {isMobileMenuOpen ? (
                            <AiOutlineClose />
                        ) : (
                            <AiOutlineMenu />
                        )}
                    </button>
                </div>

                {/* Desktop Navigation */}
                <div
                    className={`hidden md:flex items-center font-medium text-[13px] text-[#CBD5E1] flex-grow justify-center ${
                        isServicePage && !token ? "service-links" : ""
                    }`}
                >
                    <div className="ml-[96px] flex items-center gap-[55px]">
                        <Link
                            to="/home"
                            className="group relative hover:text-white"
                        >
                            Home
                            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>

                        <div
                            className="relative group"

                            // onMouseEnter={handleMouseEnter}
                            // onMouseLeave={handleMouseLeave}
                        >
                            <Link to="/services">
                                <button
                                    className="flex items-center focus:outline-none hover:text-white relative"
                                    onClick={toggleDropdown}
                                >
                                    Services
                                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                                    {/* <FaChevronDown
                                    className={`ml-2 mt-0.5 h-3 w-3 transform transition-transform duration-200 ${
                                        isDropdownOpen
                                            ? "rotate-180"
                                            : "rotate-0"
                                    }`}
                                /> */}
                                </button>
                            </Link>
                            {isDropdownOpen && (
                                <div className="absolute bg-gray-100 space-y-2 text-black w-[250px] mt-2 rounded shadow-lg">
                                    {/* {token ? (
                                        // If user is authenticated (has token), show the link
                                        <Link
                                            to="/services"
                                            className="block px-4 py-2 font-medium rounded-t-lg hover:bg-gray-300"
                                        >
                                            Add Your Business Service
                                        </Link>
                                    ) : (
                                        // If not authenticated, you can show a modal or prompt to sign in
                                        <Link
                                            to="/services"
                                            className="block px-4 py-2 font-medium rounded-t-lg hover:bg-gray-300 text-black"
                                        >
                                            Add Your Business
                                        </Link>
                                    )} */}
                                </div>
                            )}
                        </div>

                        <div>
                            {isServicePage ? (
                                token ? (
                                    <a
                                        href="/dashboard/add-service"
                                        className="group relative hover:text-white"
                                    >
                                        Add Your Services
                                        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                                    </a>
                                ) : (
                                    <button
                                        onClick={() => setIsAuthModalOpen(true)} // Trigger authentication modal
                                        className="group relative hover:text-white"
                                    >
                                        Add Your Services
                                        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                                    </button>
                                )
                            ) : token ? (
                                <a
                                    href="/dashboard/addbusiness"
                                    className="group relative hover:text-white"
                                >
                                    Add Your Business
                                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            ) : (
                                <button
                                    onClick={() => setIsAuthModalOpen(true)} // Trigger authentication modal
                                    className="group relative hover:text-white"
                                >
                                    Add Your Business
                                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sign In Section */}
                {/* Sign In Section */}
                <div className="hidden md:flex items-center gap-3 ml-auto">
                    {" "}
                    {/* Updated to hidden md:flex */}
                    {/* {token ? (
                        <Link
                            to="/dashboard"
                            className="group relative  font-bold text-[#ffffff] text-[13px] hover:text-white ml-16"
                        >
                            Dashboard
                            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ) : (
                        !isServicePage && (
                            <button
                                onClick={() => setIsCreateInvModalOpen(true)}
                                className="group relative font-bold text-[#CBD5E1] text-[13px] hover:text-white"
                            >
                                Create Investor Account
                                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                            </button>
                        )
                    )} */}
                    <div className="relative" ref={dropdownRef}>
                        {/* Dashboard Link */}
                        {token ? (
                            <Link
                                to="/dashboard"
                                className="group relative font-bold text-white/90 text-xs hover:text-white ml-16"
                            >
                                Dashboard
                                <span className="absolute left-0 bottom-0 w-0 h-px bg-yellow-400/80 transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ) : (
                            <button
                                onClick={() => setIsDropdown(!isDropdown)}
                                className="group relative font-bold text-white/90 text-xs ml-2 hover:text-white  flex items-center"
                            >
                                Grants & Investment
                                <span className="absolute left-0 bottom-0 w-0 h-px bg-yellow-400/80 transition-all duration-300 group-hover:w-full" />
                                <svg
                                    className={`ml-1 w-3 h-3 transition-transform duration-300 ${
                                        isDropdown ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                        )}
                        {/* Dropdown Menu */}
                        {isDropdown && (
                            <div
                                className="absolute left-0 mt-2 w-48 backdrop-blur-md rounded-lg shadow-lg z-50 border border-white/20 overflow-hidden"
                                style={{
                                    background: "rgba(255, 255, 255, 0.1)",
                                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <ul className="py-1 text-sm text-white/90">
                                    <li>
                                        <a
                                            href="/investment-capital"
                                            className="block px-3 py-2 hover:bg-white/10 transition-colors"
                                            onClick={() => setIsDropdown(false)}
                                        >
                                            Investor Capital
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/grant-funding"
                                            className="block px-3 py-2 hover:bg-white/10 transition-colors"
                                            onClick={() => setIsDropdown(false)}
                                        >
                                            Grant Funding
                                        </a>
                                    </li>
                                    {!isServicePage && (
                                        <li>
                                            <button
                                                onClick={() => {
                                                    setIsCreateInvModalOpen(
                                                        true
                                                    );
                                                    setIsDropdown(false);
                                                }}
                                                className="w-full text-left px-3 py-2 hover:bg-white/10 transition-colors"
                                            >
                                                Create Individual Investor
                                                Account
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                    {token ? (
                        <button
                            onClick={() => {
                                setToken(null); // Clear token to sign out
                                setUser(null); // Optional: Clear user information on sign out
                                showAlert(
                                    "success",
                                    "You have been signed out successfully!"
                                ); // Show success alert
                            }}
                            className="bg-white py-2 hover:bg-yellow-400 hover:text-red-900 rounded-[8px] text-[13px] px-5 text-[#0F172A] font-semibold"
                        >
                            Sign Out
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="bg-white py-2 hover:bg-yellow-400 hover:text-black rounded-[8px] text-[13px] px-5 text-[#0F172A] font-semibold"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`fixed top-0 right-0 w-2/3 h-full z-50 bg-green-900 text-white transform transition-transform duration-300 ${
                    isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col mt-4 p-4">
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="mb-4 self-end"
                    >
                        <AiOutlineClose className="text-white" />
                    </button>
                    <div className="flex items-start flex-col space-y-8">
                        <a
                            href="/"
                            className="block px-4 py-2 hover:bg-green-700/50 rounded-md"
                        >
                            Home
                        </a>
                        <div className="relative pl-4 inline-block">
                            <Link to={"/services"}>
                                <button
                                    className="flex items-center focus:outline-none"
                                    onClick={() =>
                                        setIsDropdownOpen(!isDropdownOpen)
                                    }
                                >
                                    Services
                                    {/* <img
                                    src={down}
                                    alt="Dropdown Icon"
                                    className={`ml-1 mt-1 h-2 w-3 transform transition-transform duration-200 ${
                                        isDropdownOpen
                                            ? "rotate-180"
                                            : "rotate-0"
                                    }`}
                                /> */}
                                </button>
                            </Link>
                            {/* {isDropdownOpen && (
                                <div className="absolute bg-gray-100 space-y-2 text-black w-[250px] mt-2 rounded shadow-lg">
                                    {token ? (
                                        // If user is authenticated (has token), show the link
                                        <Link
                                            to="/services"
                                            className="block px-4 py-2 font-medium rounded-t-lg hover:bg-gray-300"
                                        >
                                            Add Your Business Service
                                        </Link>
                                    ) : (
                                        // If not authenticated, you can show a modal or prompt to sign in
                                        <Link
                                            to="/services"
                                            className="block px-4 py-2 font-medium rounded-t-lg hover:bg-gray-300 text-black"
                                        >
                                            Add Your Business
                                        </Link>
                                    )}
                                </div>
                            )} */}
                        </div>
                        <div>
                            {isServicePage ? (
                                token ? (
                                    <a
                                        href="/dashboard"
                                        className="block px-4 py-2 hover:text-white relative group"
                                    >
                                        Add Your Services
                                        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                                    </a>
                                ) : (
                                    <button
                                        onClick={() => setIsAuthModalOpen(true)} // Trigger authentication modal
                                        className="block px-4 py-2 hover:text-white relative group"
                                    >
                                        Add Your Services
                                        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                                    </button>
                                )
                            ) : token ? (
                                <a
                                    href="/dashboard"
                                    className="block px-4 py-2 hover:text-white relative group"
                                >
                                    Add Your Business
                                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            ) : (
                                <button
                                    onClick={() => setIsAuthModalOpen(true)} // Trigger authentication modal
                                    className="block px-4 py-2 hover:text-white relative group"
                                >
                                    Add Your Business
                                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                                </button>
                            )}

                            <div className="mt-6">
                                {token ? (
                                    <Link
                                        to="/dashboard"
                                        className="block px-4 py-2 hover:bg-green-700/50 rounded-md"
                                    >
                                        Dashboard
                                        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() =>
                                            setIsCreateInvModalOpen(true)
                                        }
                                        className="block ml-4 py-2 hover:text-white relative group"
                                    >
                                        Create Investor Account
                                        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 ml-4">
                            {token ? (
                                <button
                                    onClick={() => {
                                        setToken(null); // Clear token to sign out
                                        setUser(null); // Optional: Clear user information on sign out
                                        showAlert(
                                            "success",
                                            "You have been signed out successfully!"
                                        ); // Show success alert when signing out
                                    }}
                                    className="bg-white py-2 hover:bg-green-800 hover:text-red-100 rounded-[8px] px-5 text-[#0F172A] font-semibold block w-full text-center"
                                >
                                    Sign Out
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setIsAuthModalOpen(true); // Show info alert when clicking Sign In
                                    }}
                                    className="bg-white py-2 hover:bg-green-400 hover:text-green-100 rounded-[8px] px-5 text-[#0F172A] font-semibold block w-full text-center"
                                >
                                    Sign In
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
            <CreateInvAccountModal
                isOpen={isCreateInvModalOpen}
                onClose={() => setIsCreateInvModalOpen(false)}
            />
        </div>
    );
};

export default Navbar;
