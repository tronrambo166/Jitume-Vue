import React, { createContext, useContext, useState } from "react";

// Create a context for alerts
const AlertContext = createContext();

// Provide context to components
export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    // Function to show an alert
    const showAlert = (type, message) => {
        const newAlert = { type, message, id: Date.now() }; // Use a unique ID
        setAlerts((prevAlerts) => [...prevAlerts, newAlert]);

        setTimeout(() => {
            setAlerts((prevAlerts) =>
                prevAlerts.filter((alert) => alert.id !== newAlert.id)
            );
        }, 4000); // Hide alert after 4 seconds
    };

    // Function to dismiss an alert manually
    const dismissAlert = (id) => {
        setAlerts((prevAlerts) =>
            prevAlerts.filter((alert) => alert.id !== id)
        );
    };

    return (
        <AlertContext.Provider value={{ alerts, showAlert, dismissAlert }}>
            {children}
            {alerts.map((alert) => (
                <Alert key={alert.id} {...alert} />
            ))}
        </AlertContext.Provider>
    );
};

// Custom hook to use the alert context
export const useAlert = () => useContext(AlertContext);

// The Alert component to display the message
const Alert = ({ type, message, id }) => {
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
                    className="shrink-0 w-6 h-6"
                >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="M9 12l2 2 4-4"></path>
                </svg>
            ),
        },
        error: {
            bg: "bg-red-50 border-red-200 text-red-800",
            icon: (
                <svg
                    className="shrink-0 w-6 h-6 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <path d="M12 9v4"></path>
                    <path d="M12 17h.01"></path>
                </svg>
            ),
        },
        info: {
            bg: "bg-blue-50 border-blue-200 text-blue-800",
            icon: (
                <svg
                    className="shrink-0 w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
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
    };

    const config = typeConfig[type];

    return (
        <div
            className={`fixed top-5 right-5 flex items-center rounded-lg p-4 border ${config.bg} backdrop-blur-sm transition-all transform animate-slide-in z-50`}
        >
            <div className="mr-3">{config.icon}</div>
            <div className="flex-grow">
                <span>{message}</span>
            </div>
            <button
                onClick={() => dismissAlert(id)}
                className="ml-3 text-xl font-bold text-gray-600 hover:text-gray-800"
            >
                &times;
            </button>
        </div>
    );
};
