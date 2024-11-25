import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import LoginForm from "./Loginform";
import RegisterForm from "./Signup";
import logo2 from "../../images/logo2.png";
import { useStateContext } from "../../contexts/contextProvider"; // Ensure this import is correct

const Modal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const { token } = useStateContext(); // Use context for token
    const [isRegistrationComplete, setRegistrationComplete] = useState(false);

    useEffect(() => {
        if (token && isRegistrationComplete) {
            onClose(); // Close only after registration is complete
        }
    }, [token, isRegistrationComplete, onClose]);

    useEffect(() => {
        // Prevent body scroll when modal is open
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    if (!isOpen || token) return null; // Prevent rendering if modal is closed or token exists

    return (
        <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-start z-50 overflow-y-auto"
            style={{
                minHeight: "100vh", // Ensure overlay takes full viewport height
            }}
        >
            <div
                className={`bg-white rounded-xl m-3 p-4 sm:p-6 relative w-[95vw] max-w-[500px] sm:w-[85vw] sm:max-w-[450px] lg:w-[70vw] lg:max-w-[500px] mx-auto mt-3 sm:mt-20 ${
                    isLogin ? "max-h-[calc(100vh-270px)]" : "none"
                }`}
                style={{
                    maxHeight: isLogin ? "calc(100vh - 30px)" : "none", // Adjust separately for LoginForm and RegisterForm
                }}
            >
                <div className="flex justify-center py-4">
                    <img
                        src={logo2}
                        alt="Logo"
                        className="h-[45px] w-[120px]"
                    />
                </div>
                <hr className="py-2" />
                <button
                    className="absolute top-3 right-5 text-gray-700 text-3xl hover:text-gray-900"
                    onClick={onClose}
                >
                    &times;
                </button>
                <div className="flex justify-center mb-4 text-sm">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`px-4 py-2 ${
                            isLogin ? "underline text-green" : "text-gray-700"
                        } rounded-l-lg`}
                    >
                        Sign in
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`px-4 py-2 ${
                            !isLogin ? "underline text-green" : "text-gray-700"
                        } rounded-r-lg`}
                    >
                        Register
                    </button>
                </div>
                <div>
                    {/* Render LoginForm or RegisterForm based on isLogin */}
                    {isLogin ? (
                        <div
                            className=""
                            style={{
                                maxHeight: "calc(100vh - 40px)", // Limit height for LoginForm
                            }}
                        >
                            <LoginForm />
                        </div>
                    ) : (
                        <div>
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
