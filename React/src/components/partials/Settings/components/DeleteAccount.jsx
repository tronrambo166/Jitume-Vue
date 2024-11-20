import React, { useState } from "react";
import { useAlert } from "../../AlertContext"; // Importing the useAlert hook
import Jitumelog from "../../../../assets/logo3.png";
const DeleteAccount = ({ userName = "Harry Entrepreneur" }) => {
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmationInput, setConfirmationInput] = useState("");
    const [isInputValid, setIsInputValid] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleDeleteAccount = () => {
        // Call the showAlert function to display a success or failure message
        showAlert(
            "success",
            "Your account has been deleted successfully."
        );
        closeModal();
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setConfirmationInput(value);
        setIsInputValid(value === `${userName} account`);
    };

    return (
        <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Delete Account</h3>
            <p className="text-gray-400 mb-4">
                No longer want to use our service? You can delete your account
                here. This action is not reversible. All information related to
                this account will be deleted permanently.
            </p>
            <button
                onClick={openModal}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
                Yes, delete my account
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow-lg">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                        >
                            <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="p-4 md:p-5 text-center">
                            <svg
                                className="mx-auto mb-4 text-gray-400 w-12 h-12"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500">
                                Are you sure you want to delete your account?
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Deleting your account is a permanent action. You
                                will lose all your data, and it cannot be
                                recovered. Please confirm by typing your full
                                name and the word "account" below.
                            </p>

                            {/* Confirmation Input */}
                            <div className="mb-4">
                                <label
                                    htmlFor="confirmationInput"
                                    className="block text-gray-700 font-medium mb-2"
                                >
                                    Type "{userName} account" to confirm
                                </label>
                                <input
                                    id="confirmationInput"
                                    type="text"
                                    value={confirmationInput}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Type the name to confirm"
                                />
                            </div>

                            <div className="flex justify-between space-x-4">
                                <button
                                    onClick={closeModal}
                                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                                >
                                    No, cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={!isInputValid}
                                    className={`px-4 py-2 ${
                                        isInputValid
                                            ? "bg-red-600 text-white hover:bg-red-500"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    } rounded focus:outline-none`}
                                >
                                    Yes, I'm sure
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteAccount;
