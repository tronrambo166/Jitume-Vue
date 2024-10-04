import { useState,uselocation } from "react";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";
import Modal from "./Authmodal";
import CreateInvAccountModal from "../partials/CreateInvAccount";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCreateInvModalOpen, setIsCreateInvModalOpen] = useState(false);

    const handleAuthModalOpen = (event) => {
        event.preventDefault();
        setIsAuthModalOpen(true);
    };

    const handleCreateInvModalOpen = (event) => {
        event.preventDefault();
        setIsCreateInvModalOpen(true);
    };

    return (
        <nav
            className="bg-white sm:px-8 dark:bg-dark-bg border-b-black/50"
            style={{ borderBottom: "1px solid #0000002b" }}
        >
            <div className="container mx-auto flex items-center justify-between p-4">
                <div className="flex flex-row-reverse items-center justify-between w-full md:w-auto">
                    <div className="text-xl text-black dark:text-dark-text order-2 md:order-1">
                        <img src={logo} alt="Logo" />
                    </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="md:hidden text-green dark:text-dark-green order-1 md:order-2"
                        aria-label="Open menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            ></path>
                        </svg>
                    </button>
                </div>

                <div className="hidden md:flex flex-1 text-sm font-semibold justify-center md:gap-0 lg:gap-[50px] sm:gap-[50px] md:px-3 space-x-6">
                <Link
        to="/home"
        className={`hover:text-green dark:hover:text-dark-green ${location.pathname === '/home' ? 'underline decoration-2 underline-offset-4' : ''}`}
      >
        Home
      </Link>
      <Link
        to="/services"
        className={`hover:text-green dark:hover:text-dark-green ${location.pathname === '/services' ? 'underline decoration-2 underline-offset-4' : ''}`}
      >
        Services
      </Link>
      <a
  href="#"
  onClick={handleAuthModalOpen}
  className="hover:text-green dark:hover:text-dark-green"
>
  {location.pathname === '/services' ? 'Add Your Service' : 'Add Your Business'}
</a>

      <a
        href="#"
        onClick={handleCreateInvModalOpen}
        className="hover:text-green dark:hover:text-dark-green"
      >
        Create Investor Account
      </a>
                </div>

                <div className="hidden md:block">
                    <button
                        className="border hover:text-green border-black text-black px-4 py-2 text-sm font-semibold rounded-lg hover:bg-green-700 dark:bg-dark-green dark:hover:bg-dark-slate"
                        onClick={() => setIsAuthModalOpen(true)}
                    >
                        Sign In
                    </button>
                </div>
            </div>

            <div
                className={`fixed top-0 left-0 w-64 h-screen bg-white shadow-lg dark:bg-dark-bg transform transition-transform duration-300 ease-in-out md:hidden ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } z-50`}
            >
                <div className="flex justify-end p-4">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-green dark:text-dark-green"
                        aria-label="Close menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col py-6 px-4 justify-center mt-10 space-y-6">
                <Link
        to="/home"
        className={`hover:text-green dark:hover:text-dark-green ${location.pathname === '/home' ? 'underline decoration-2 underline-offset-4' : ''}`}
      >
        Home
      </Link>
      <Link
        to="/services"
        className={`hover:text-green dark:hover:text-dark-green ${location.pathname === '/services' ? 'underline decoration-2 underline-offset-4' : ''}`}
      >
        Services
      </Link>
      <a
  href="#"
  onClick={handleAuthModalOpen}
  className="hover:text-green dark:hover:text-dark-green"
>
  {location.pathname === '/services' ? 'Add Your Service' : 'Add Your Business'}
</a>

      <a
        href="#"
        onClick={handleCreateInvModalOpen}
        className="hover:text-green dark:hover:text-dark-green"
      >
        Create Investor Account
      </a>
                </div>
                <div className="flex px-4 mt-6">
                    <button
                        className="bg-green text-white px-4 py-2 rounded hover:bg-green-700 dark:bg-dark-green dark:hover:bg-dark-slate"
                        onClick={() => setIsAuthModalOpen(true)}
                    >
                        Sign In
                    </button>
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
        </nav>
    );
};

export default Navbar;
