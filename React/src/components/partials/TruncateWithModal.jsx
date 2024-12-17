import React, { useState } from "react";
import { FaTimes } from "react-icons/fa"; // Import the close icon

const TruncateWithModal = ({
    content,
    maxLength = 300,
    buttonText = "View More",
    modalTitle = "Details",
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    const isTruncated = content.length > maxLength;

    return (
        <div>
            {/* Truncated Text with Inline "View More" */}
            <p className="text-[#1E293B] text-[18px] mb-3">
                {isTruncated ? (
                    <>
                        {content.slice(0, maxLength)}...{" "}
                        <button
                            onClick={handleModalOpen}
                            className="text-green underline text-base inline-block"
                        >
                            {buttonText}
                        </button>
                    </>
                ) : (
                    content
                )}
            </p>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 p-4 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 overflow-y-auto max-h-[80vh] relative">
                        <h2 className="text-xl font-semibold mb-4">
                            {modalTitle}
                        </h2>
                        <p className="text-[#1E293B] text-[16px] leading-6">
                            {content}
                        </p>
                        {/* Close Icon (X) */}
                        <button
                            onClick={handleModalClose}
                            className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TruncateWithModal;
