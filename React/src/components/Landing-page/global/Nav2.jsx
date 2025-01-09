import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import {
    AiOutlineDown,
    AiOutlineUp,
    AiOutlineMenu,
    AiOutlineClose,
} from "react-icons/ai";
import logo from "../../../images/Tujitumelogo.svg";
import down from "../../../images/down.png";
import { FaChevronDown } from "react-icons/fa";
import Modal from "../../partials/Authmodal";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import CreateInvAccountModal from "../../partials/CreateInvAccount";
import { useStateContext } from "../../../contexts/contextProvider";
import axiosClient from "../../../axiosClient";

const Nav2 = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCreateInvModalOpen, setIsCreateInvModalOpen] = useState(false);
    const [closeTimeout, setCloseTimeout] = useState(null); // New state
    const location = useLocation(); // Hook to access location
    const isServicePage = /^\/service-details\/.+/.test(location.pathname);

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

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdown = document.getElementById("dropdown");
            if (dropdown && !dropdown.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const handleMouseEnter = () => {
        clearTimeout(closeTimeout); // Clear any existing timeout to prevent closing
        setIsDropdownOpen(true); // Open the dropdown
    };
    const { user, token, setUser, setToken } = useStateContext();

    const handleMouseLeave = () => {
        const timeoutId = setTimeout(() => setIsDropdownOpen(false), 400); // Delay closing the dropdown
        setCloseTimeout(timeoutId); // Store the timeout ID
    };

    const handleClick = () => {
        clearTimeout(closeTimeout); // Clear the timeout on click
        setIsDropdownOpen((prev) => !prev); // Toggle dropdown on click
    };

    return (
        <div className="py-3 px-[35px] text-white relative z-50">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                    <Link>
                        <span to="/">
                            <img src={logo} width={130} alt="Logo" />
                        </span>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-black"
                    >
                        {isMobileMenuOpen ? (
                            <AiOutlineClose />
                        ) : (
                            <AiOutlineMenu />
                        )}
                    </button>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center font-medium xl:text-[15px] lg:text-[13px] text-[#475569] flex-grow justify-center">
                    <div className="ml-[120px] flex items-center gap-[55px]">
                        <Link
                            to="/home"
                            className="group relative hover:text-green-500"
                        >
                            Home
                            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>

                        <div
                            className="relative inline-block group"
                            // onMouseEnter={handleMouseEnter}
                            // onMouseLeave={handleMouseLeave}
                        >
                            <Link to="/services">
                                <button
                                    className="flex items-center focus:outline-none hover:text-green-500 relative"
                                    aria-haspopup="true"
                                    onClick={isDropdownOpen} // Toggle dropdown on click
                                >
                                    Services
                                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                                    {/* <FaChevronDown
                                    className={`ml-3 mt-[6px] transition-transform duration-300 ${
                                        isDropdownOpen ? "rotate-180" : ""
                                    }`} // Rotate icon when dropdown is open
                                /> */}
                                </button>
                            </Link>
                            {isDropdownOpen && (
                                <div className="absolute bg-gray-100 z-20 space-y-2 text-black w-[250px] mt-2 rounded shadow-lg">
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
                                        <button
                                            onClick={() =>
                                                setIsAuthModalOpen(true)
                                            } // Trigger the authentication modal
                                            className="block px-4 py-2 font-medium rounded-t-lg hover:bg-gray-300 text-black"
                                        >
                                            Add Your Business
                                        </button>
                                    )} */}
                                </div>
                            )}
                        </div>

                        <div>
                            {isServicePage ? (
                                token ? (
                                    // If user is authenticated (has token), show the link for the service page
                                    <a
                                        href="/dashboard"
                                        className="group relative hover:text-green-500"
                                    >
                                        Add Your Services
                                        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                                    </a>
                                ) : (
                                    // If not authenticated, show a button to trigger authentication modal for the service page
                                    <button
                                        onClick={() => setIsAuthModalOpen(true)} // Trigger authentication modal
                                        className="group relative text-[#475569] hover:text-green-500"
                                    >
                                        Add Your Services
                                        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                                    </button>
                                )
                            ) : token ? (
                                // If not on the service page, and the user is authenticated, show the link for the business page
                                <a
                                    href="/dashboard"
                                    className="group relative hover:text-green-500"
                                >
                                    Add Your Business
                                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            ) : (
                                // If not on the service page, and the user is not authenticated, show the button for the business page
                                <button
                                    onClick={() => setIsAuthModalOpen(true)} // Trigger authentication modal
                                    className="group relative text-[#475569] hover:text-green-500"
                                >
                                    Add Your Business
                                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sign In Section */}
                <div className="flex items-center gap-3 hidden md:flex">
                    {token ? (
                        // User is signed in
                        <>
                            <Link
                                to="/dashboard"
                                className="group relative font-semibold text-[#475569] xl:text-[15px] text-[13px] hover:text-green-500 ml-24"
                            >
                                Dashboard
                                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <button
                                onClick={() => {
                                    setToken(null); // Clear token
                                    setUser(null); // Clear user information
                                }}
                                className="bg-green-700 py-2 hover:bg-green-800 hover:text-red-100 rounded-[8px] xl:text-[15px] text-[13px] px-5 font-semibold text-white"
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        // User is not signed in
                        <>
                            <button
                                onClick={() => setIsCreateInvModalOpen(true)} // Open Create Investor Account modal
                                className="group relative font-semibold text-[#475569] xl:text-[15px] text-[13px] hover:text-green-500"
                            >
                                Create Investor Account
                                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                            </button>

                            <button
                                onClick={() => setIsAuthModalOpen(true)} // Open auth modal
                                className="bg-black py-2 hover:bg-green-700 hover:text-green-100 rounded-[8px] xl:text-[15px] text-[13px] px-5 font-semibold text-white"
                            >
                                Sign in
                            </button>
                        </>
                    )}

                    {/* Render the Create Investor Account Modal */}
                    {isCreateInvModalOpen && (
                        <CreateInvAccountModal
                            isOpen={isCreateInvModalOpen}
                            onClose={() => setIsCreateInvModalOpen(false)}
                        />
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
                    <div className="flex justify-start flex-col space-y-8">
                        <a
                            href="/"
                            className="block px-4 py-2 hover:bg-green-700/50 rounded-md"
                        >
                            Home
                        </a>
                        <div className="relative pl-4 inline-block">
                            <Link to="/services">
                                <button
                                    className="flex items-center focus:outline-none"
                                    onClick={() =>
                                        setIsDropdownOpen(!isDropdownOpen)
                                    } // Toggle dropdown
                                    // aria-haspopup="true"
                                    // aria-expanded={isDropdownOpen}
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
                                <div className="absolute space-y-2 bg-gray-100 z-50 py-3 text-black w-[250px] h-[150px] mb-2 mt-2 rounded shadow-lg">
                                    <a
                                        href="#"
                                        className="block px-4 py-2 font-medium hover:bg-gray-300"
                                    >
                                        Service 1
                                    </a>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 font-medium hover:bg-gray-300"
                                    >
                                        Service 2
                                    </a>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 font-medium hover:rounded-b hover:bg-gray-200"
                                    >
                                        Service 3
                                    </a>
                                </div>
                            )} */}
                        </div>
                        <div>
                            {token ? (
                                <a
                                    href="/home"
                                    className="block px-4 py-2 mb-6  hover:bg-green-700/50 rounded-md"
                                >
                                    Add Your Business
                                </a>
                            ) : (
                                <button
                                    onClick={() => setIsAuthModalOpen(true)} // Open authentication modal if no token
                                    className="block px-4 py-2 mb-6 hover:bg-green-700/50 rounded-md"
                                >
                                    Add Your Business
                                </button>
                            )}

                            {token ? (
                                <a
                                    href="/dashboard"
                                    className="block px-4 py-2 hover:bg-green-700/50 rounded-md"
                                >
                                    Dashboard
                                </a>
                            ) : (
                                <button
                                    onClick={() =>
                                        setIsCreateInvModalOpen(true)
                                    } // Open account creation modal if no token
                                    className="block px-4 py-2 hover:bg-green-700/50 rounded-md"
                                >
                                    Create Investor Account
                                </button>
                            )}
                        </div>

                        {token ? (
                            <button
                                onClick={() => {
                                    setToken(null); // Clear token to sign out
                                    setUser(null); // Optional: Clear user information on sign out
                                }}
                                className="bg-white py-2 hover:bg-green-800 hover:text-red-100 rounded-[8px] text-[13px] px-5 text-[#0F172A] font-semibold"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="bg-white py-2 hover:bg-green-400 hover:text-green-100 rounded-[8px] text-[13px] px-5 text-[#0F172A] font-semibold"
                            >
                                Sign In
                            </button>
                        )}
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

export default Nav2;
