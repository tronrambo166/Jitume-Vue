import React from "react";
import { FiSend } from "react-icons/fi";

function MessageInput({ value, onChange, onSend }) {
    return (
        <div className="p-4 border-t flex items-center fixed-bottom-0 bg-white z-10 shadow-lg">
            <textarea
                className="flex-1 border rounded-lg p-1 sm:p-2 mr-2 sm:mr-3 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 shadow-sm placeholder-gray-400 resize-none text-sm sm:text-base align-top transition-all duration-200 ease-in-out"
                placeholder="Type a message..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    minHeight: "48px",
                    maxHeight: "120px",
                    overflowY: "auto",
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onSend();
                    }
                }}
            ></textarea>

            <button
                className="bg-green-700 text-white p-3 rounded-full hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
                onClick={onSend}
            >
                <FiSend className="w-5 h-5" />
            </button>
        </div>
    );
}

export default MessageInput;
