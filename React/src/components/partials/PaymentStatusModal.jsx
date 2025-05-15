import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentStatusModal = ({ status, onClose, transactionId, onRetry }) => {
    const [fadeOut, setFadeOut] = useState(false);
    const navigate = useNavigate();

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === "Escape" && status !== "processing") {
                handleClose();
            }
        };

        window.addEventListener("keydown", handleEscKey);
        return () => window.removeEventListener("keydown", handleEscKey);
    }, [status]);

    // Handle smooth closing animation
    const handleClose = () => {
        if (status !== "processing") {
            setFadeOut(true);
            setTimeout(() => {
                onClose();
            }, 300);
        }
    };

    // Prevent closing when clicking modal background during processing
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && status !== "processing") {
            handleClose();
        }
    };

    // Show jQuery confirm for success state
    useEffect(() => {
        if (status === "success") {
            // Close the current modal first
            setFadeOut(true);
            setTimeout(() => {
                onClose();

                // Show the jQuery confirm dialog
                $.confirm({
                    title: "Payment Successful",
                    content: "Go to Dashboard to see investment status.",
                    buttons: {
                        yes: function () {
                            navigate("/dashboard");
                        },
                        home: function () {
                            navigate("/");
                        },
                        cancel: function () {
                            $.alert("Canceled!");
                        },
                    },
                });
            }, 300);
        }
    }, [status, navigate, onClose]);

    // Don't render anything for success state as we're using $.confirm instead
    if (status === "success") {
        return null;
    }

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 transition-opacity duration-300 ${
                fadeOut ? "opacity-0" : "opacity-100"
            }`}
            onClick={handleBackdropClick}
        >
            <div
                className={`bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden transition-all duration-300 transform ${
                    fadeOut ? "scale-95" : "scale-100"
                }`}
            >
                {/* Modal header with color based on status */}
                <div
                    className={`py-4 px-6 ${
                        status === "processing" ? "bg-emerald-50" : "bg-red-50"
                    }`}
                >
                    <div className="flex justify-center">
                        {status === "processing" && (
                            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                                <svg
                                    className="animate-spin h-10 w-10 text-emerald-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            </div>
                        )}

                        {status === "failed" && (
                            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                                <svg
                                    className="h-10 w-10 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal body */}
                <div className="p-6">
                    <h2
                        className={`text-2xl font-bold text-center mb-3 ${
                            status === "processing"
                                ? "text-emerald-700"
                                : "text-red-700"
                        }`}
                    >
                        {status === "processing" && "Processing Payment"}
                        {status === "failed" && "Payment Failed"}
                    </h2>

                    <p className="text-gray-700 text-center mb-4">
                        {status === "processing" &&
                            "Please wait while we process your payment..."}
                        {status === "failed" &&
                            "We couldn't process your payment. Please try again."}
                    </p>

                    {/* Transaction ID */}
                    <div className="bg-gray-50 rounded p-3 mb-4 flex items-center justify-center">
                        <span className="text-xs text-gray-400">
                            Powered by <strong>Lipr Technologies Ltd</strong>
                        </span>
                    </div>

                    {/* Troubleshooting tips for failed payments */}
                    {status === "failed" && (
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                                Please check the following:
                            </p>
                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
                                <ul className="space-y-1">
                                    <li className="flex items-start">
                                        <svg
                                            className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span>
                                            Verify your phone number is correct
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg
                                            className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span>
                                            Check your mobile money account
                                            balance
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg
                                            className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span>
                                            Ensure you entered the correct PIN
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-center space-x-3 mt-6">
                        {status === "processing" ? (
                            <button
                                disabled
                                className="px-6 py-2 bg-emerald-100 text-emerald-500 rounded-lg font-medium cursor-not-allowed"
                            >
                                Processing...
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleClose}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        handleClose();
                                        if (onRetry) onRetry();
                                    }}
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                >
                                    Try Again
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentStatusModal;
