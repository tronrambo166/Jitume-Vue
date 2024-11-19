import React, { createContext, useContext, useState } from "react";

// Create a context for alerts
const AlertContext = createContext();

// Provide context to components
export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState({
        type: "",
        message: "",
        isVisible: false,
    });

    // Function to show an alert
    const showAlert = (type, message) => {
        setAlert({ type, message, isVisible: true });
        setTimeout(() => setAlert({ ...alert, isVisible: false }), 4000); // Hide alert after 4 seconds
    };

    // Function to dismiss an alert manually
    const dismissAlert = () => setAlert({ ...alert, isVisible: false });

    return (
        <AlertContext.Provider value={{ alert, showAlert, dismissAlert }}>
            {children}
            {alert.isVisible && <Alert {...alert} />}
        </AlertContext.Provider>
    );
};

// Custom hook to use the alert context
export const useAlert = () => useContext(AlertContext);

// The Alert component to display the message
const Alert = ({ type, message }) => {
    const { dismissAlert } = useAlert();

    // Alert configurations for different types
    const typeConfig = {
        success: {
            bg: "bg-teal-50 border-teal-200 text-teal-800",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                </svg>
            ),
        },
        error: {
            bg: "bg-red-50 border-red-200 text-red-800",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12" y2="16"></line>
                </svg>
            ),
        },
        info: {
            bg: "bg-blue-50 border-blue-200 text-blue-800",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="16"></line>
                    <line x1="12" y1="8" x2="12" y2="8"></line>
                </svg>
            ),
        },
    };

    const config = typeConfig[type];

    return (
        <div
            className={`fixed top-5 right-5 flex items-center rounded-lg p-4 border ${config.bg} backdrop-blur-sm  transition-all transform  animate-slide-in z-50`}
        >
            <div className="mr-3">{config.icon}</div>
            <div className="flex-grow">
                <span>{message}</span>
            </div>
            <button
                onClick={dismissAlert}
                className="ml-3 text-xl font-bold text-gray-600 hover:text-gray-800"
            >
                &times;
            </button>
        </div>
    );
};
