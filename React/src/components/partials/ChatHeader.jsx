import React from "react";
import { FaArrowCircleLeft } from "react-icons/fa";

function ChatHeader({ selectedMessage, onBackClick }) {
    return (
        <div className="p-4 bg-white fixed-top w-full z-50 flex items-center border-b">
            <button
                onClick={onBackClick}
                className="text-blue-500 hover:text-blue-700"
            >
                <FaArrowCircleLeft className="text-green-600" />
            </button>
            <img
                src={
                    selectedMessage.avatarUrl ||
                    "https://agri-soko-2-1.vercel.app/assets/default-BeD4CxIB.jpg"
                }
                alt="Profile"
                className="w-10 h-10 rounded-full mr-4"
            />
            <div>
                <h4 className="text-lg font-semibold">
                    {selectedMessage.sender}
                </h4>
            </div>
        </div>
    );
}

export default ChatHeader;
