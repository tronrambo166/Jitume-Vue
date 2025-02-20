import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import LoginForm from "./Loginform";
import RegisterForm from "./Signup";
import logo2 from "../../images/Tujitumelogo.svg";
import { useStateContext } from "../../contexts/contextProvider";

const Modal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const { token } = useStateContext();
    const [isRegistrationComplete, setRegistrationComplete] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    if (!isOpen || token) return null;
    const isDashboard = location.pathname.startsWith("/dashboard");

    return (
        <div
            className={`fixed inset-0 flex justify-center items-start z-50 overflow-y-auto transition-opacity ${
                isDashboard
                    ? "bg-gray-600 bg-opacity-75 backdrop-blur-lg"
                    : "bg-transparent"
            }`}
            style={{
                minHeight: "100vh",
            }}
        >
            <div
                className={`bg-white  rounded-xl m-3 p-4 sm:p-6 relative w-[95vw] max-w-[500px] sm:w-[85vw] sm:max-w-[450px] lg:w-[70vw] lg:max-w-[500px] mx-auto mt-3 sm:mt-20 overflow-hidden`} // Hide scrollbars on modal
                style={{
                    maxHeight: isLogin ? "calc(100vh - 30px)" : "none", // Adjust separately for LoginForm and RegisterForm
                }}
            >
                {/* Close button */}
                <button
                    className="absolute top-3 right-5 text-gray-700 text-2xl hover:text-gray-900"
                    onClick={onClose}
                >
                    &times;
                </button>

                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <img src={logo2} alt="Logo" className="h-[40px] w-auto" />
                </div>

                {/* Tabs */}
                <div className="flex justify-center space-x-4 text-sm mb-4">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`px-4 py-2 ${
                            isLogin
                                ? "text-green-600 underline"
                                : "text-gray-700"
                        }`}
                    >
                        Sign in
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`px-4 py-2 ${
                            !isLogin
                                ? "text-green-600 underline"
                                : "text-gray-700"
                        }`}
                    >
                        Register
                    </button>
                </div>

                <hr className="mb-4" />

                {/* Content (with scrollable inner container) */}
                <div className="overflow-y-auto max-h-[calc(100vh-180px)] thin-scrollbar">
                    {isLogin ? (
                        <div>
                            <LoginForm />
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-center text-lg font-semibold mb-2">
                                Register
                            </h2>
                            <p className="text-center text-sm text-gray-600 mb-4">
                                Enter your details to create an account
                            </p>
                            <RegisterForm />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Modal;
