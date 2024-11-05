import { useState, useEffect, useRef } from "react";
import {
    AiOutlineDown,
    AiOutlineUp,
    AiOutlineMenu,
    AiOutlineClose,
} from "react-icons/ai";
import down from "../../images/down.png";
import { useLocation } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import logo from "../../images/logo.png";
import Modal from "../partials/Authmodal";
import CreateInvAccountModal from "../partials/CreateInvAccount";
import { useStateContext } from "../../contexts/contextProvider";
import axiosClient from "../../axiosClient";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCreateInvModalOpen, setIsCreateInvModalOpen] = useState(false);
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
        <div className="py-3 px-[35px] text-white">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                    <Link to="/">
                        <span>
                            <img src={logo} width={110} alt="Logo" />
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
                <div className="hidden md:flex items-center font-medium text-[13px] text-[#CBD5E1] flex-grow justify-center">
                    <div className="ml-[120px] flex items-center gap-[55px]">
                        <Link
                            to="/home"
                            className="group relative hover:text-white"
                        >
                            Home
                            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>

                        <div
                            className="relative group"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button
                                className="flex items-center focus:outline-none hover:text-white relative"
                                onClick={toggleDropdown}
                            >
                                Services
                                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                                <FaChevronDown
                                    className={`ml-2 mt-0.5 h-3 w-3 transform transition-transform duration-200 ${
                                        isDropdownOpen
                                            ? "rotate-180"
                                            : "rotate-0"
                                    }`}
                                />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute bg-gray-100 space-y-2 text-black w-[250px] h-[130px] mb-2 mt-2 rounded shadow-lg">
                                    <Link
                                        to="/services"
                                        className="block px-4 py-2 font-medium rounded-t-lg hover:bg-gray-300"
                                    >
                                        Service 1
                                    </Link>
                                    <Link
                                        to="/services"
                                        className="block px-4 py-2 font-medium hover:bg-gray-300"
                                    >
                                        Service 2
                                    </Link>
                                    <Link
                                        to="/services"
                                        className="block px-4 py-2 font-medium rounded-b-lg hover:bg-gray-300"
                                    >
                                        Service 3
                                    </Link>
                                </div>
                            )}
                        </div>

                        <a href="#" className="group relative hover:text-white">
                            Add your business
                            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </div>
                </div>

                {/* Sign In Section */}
                <div className="flex items-center gap-3 hidden md:flex">
                    <a
                        href={token ? "/dashboard" : "#"}
                        className="group relative font-bold text-[#CBD5E1] text-[13px] hover:text-white"
                    >
                        {token ? "Dashboard" : "Create investor account"}
                        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                    </a>
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
                            href="#"
                            className="block px-4 py-2 hover:bg-green-700/50 rounded-md"
                        >
                            Home
                        </a>
                        <div className="relative pl-4 inline-block">
                            <button
                                className="flex items-center focus:outline-none"
                                onClick={() =>
                                    setIsDropdownOpen(!isDropdownOpen)
                                }
                            >
                                Services
                                <img
                                    src={down}
                                    alt="Dropdown Icon"
                                    className={`ml-1 mt-1 h-2 w-3 transform transition-transform duration-200 ${
                                        isDropdownOpen
                                            ? "rotate-180"
                                            : "rotate-0"
                                    }`}
                                />
                            </button>
                            {isDropdownOpen && (
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
                            )}
                        </div>
                        <a
                            href="#"
                            className="block px-4 py-2 hover:bg-green-700/50 rounded-md"
                        >
                            Add your business
                        </a>
                        <a
                            className="block px-4 py-2 hover:bg-green-700/50 rounded-md"
                            href="#"
                        >
                            Create investor account
                        </a>
                        <button className="block w-full bg-white hover:bg-slate-100 hover:text-green-800 py-2 rounded-[8px] text[13px] text-[#0F172A] font-semibold">
                            Sign in
                        </button>
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
