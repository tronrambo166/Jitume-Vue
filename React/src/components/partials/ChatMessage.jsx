import React from "react";
import { AiOutlineReload } from "react-icons/ai";

function ChatMessage({ message: chat, index, onRetry }) {
    return (
        <div
            className={`flex ${
                chat.sender === "me" ? "justify-end" : "justify-start"
            } mt-3`}
        >
            <div
                className={`relative p-3 rounded-2xl max-w-[80%] md:max-w-md ${
                    chat.sender === "me"
                        ? "bg-yellow-400 text-black self-end"
                        : chat.new === 1
                        ? "bg-green-100 text-black shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                } shadow-md`}
                style={{
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    wordBreak: "break-word",
                    overflow: "hidden",
                }}
            >
                <p className="text-sm leading-relaxed">{chat.msg}</p>
                <small className="text-gray-500 dark:text-gray-400 text-xs mt-2 block">
                    {new Date(chat.created_at).toLocaleString()}
                </small>
                {chat.sender === "me" && chat.status === "Failed to send" && (
                    <button
                        className="text-blue-500 text-xs flex items-center space-x-1 mt-2"
                        onClick={() => onRetry(index)}
                    >
                        <AiOutlineReload className="w-4 h-4" />
                        <span>Resend</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default ChatMessage;
