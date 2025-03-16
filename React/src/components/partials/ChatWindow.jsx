import React from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { AiOutlineReload } from "react-icons/ai";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import MessageInput from "./MessageInput";

function ChatWindow({
    selectedMessage,
    chatHistory,
    newMessage,
    chatContainerRef,
    onMessageChange,
    onSendMessage,
    onRetryMessage,
    onBackClick,
}) {
    return (
        <div className="flex-1 flex flex-col bg-gray-100 h-[700px]">
            {selectedMessage ? (
                <>
                    <ChatHeader
                        selectedMessage={selectedMessage}
                        onBackClick={onBackClick}
                    />

                    <div
                        className="flex-1 p-4 overflow-y-auto"
                        ref={chatContainerRef}
                        style={{
                            flexGrow: 1,
                            overflowY: "auto",
                        }}
                    >
                        {chatHistory.length > 0 ? (
                            chatHistory
                                .slice()
                                .reverse()
                                .map((chat, index) => (
                                    <ChatMessage
                                        key={index}
                                        message={chat}
                                        index={index}
                                        onRetry={onRetryMessage}
                                    />
                                ))
                        ) : (
                            <div className="text-center text-gray-400 mt-4">
                                No messages yet. Say hello!
                            </div>
                        )}
                    </div>

                    <MessageInput
                        value={newMessage}
                        onChange={onMessageChange}
                        onSend={() =>
                            onSendMessage(
                                selectedMessage.id,
                                selectedMessage.service_id,
                                selectedMessage.from_id
                            )
                        }
                    />
                </>
            ) : (
                <div className="flex-1 hidden md:flex items-center justify-center text-gray-500">
                    Select a conversation to start chatting
                </div>
            )}
        </div>
    );
}

export default ChatWindow;
