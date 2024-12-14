import { useEffect, useState } from "react";
import { AiOutlineReload } from "react-icons/ai"; // Retry icon
import { FiSend } from "react-icons/fi"; // Send icon
import axiosClient from "../../axiosClient";
import SkeletonLoader from "./SkeletonLoader";
import DefaultImg from "./Settings/components/DefaultImg";

function Messages() {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        const fetchMessages = () => {
            axiosClient
                .get("/business/service_messages")
                .then(({ data }) => {
                    setMessages(data.messages);
                    setLoading(false);
                    console.log(data.messages);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        };
        fetchMessages();

        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSelectMessage = (message) => {
        setSelectedMessage(message);
        setChatHistory([
            { sender: message.sender, text: message.msg, id: message.id,
            service_id: message.service_id, time: message.created_at },
        ]);
    };

    const handleSendMessage = (id, service_id) => {
        if (!newMessage.trim()) return;

        const tempMessage = {
            msg_id: id,
            service_id:service_id,
            msg: newMessage,
            //time: new Date().toLocaleString(),
        };

        setChatHistory((prev) => [...prev, tempMessage]);
        axiosClient
            .post("/serviceReply", { tempMessage })
            .then(({ response }) => {
                setChatHistory((prev) =>
                    prev.map((msg, index) =>
                        index === prev.length - 1
                            ? { ...msg, status: "Sent" }
                            : msg
                    )
                );
                console.log('hi');
            })
            .catch(() => {
                setChatHistory((prev) =>
                    prev.map((msg, index) =>
                        index === prev.length - 1
                            ? { ...msg, status: "Failed to send" }
                            : msg
                    )
                );
            });

        setNewMessage("");
    };

    const handleRetryMessage = (index) => {
        const message = chatHistory[index];
        if (message.status === "Failed to send") {
            setChatHistory((prev) =>
                prev.map((msg, idx) =>
                    idx === index ? { ...msg, status: "Sending..." } : msg
                )
            );
            axiosClient
                .post("/serviceReply", { message: message.text })
                .then(() => {
                    setChatHistory((prev) =>
                        prev.map((msg, idx) =>
                            idx === index ? { ...msg, status: "Sent" } : msg
                        )
                    );
                })
                .catch(() => {
                    setChatHistory((prev) =>
                        prev.map((msg, idx) =>
                            idx === index
                                ? { ...msg, status: "Failed to send" }
                                : msg
                        )
                    );
                });
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    if (loading) return <SkeletonLoader />;

    return (
        <div className="flex flex-col px-5 mt-4 md:flex-row h-screen text-gray-800">
            {/* Sidebar */}
            <div
                className={`w-full md:w-1/3 pt-6 bg-white border-r overflow-y-auto ${
                    isMobileView && selectedMessage ? "hidden" : ""
                }`}
                style={{ height: "calc(100vh - 4rem)" }} // Sidebar height adjustment
            >
                <div className="p-4 border-b bg-white">
                    <h3 className="text-lg font-bold">Conversations</h3>
                </div>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        onClick={() => handleSelectMessage(msg)}
                        className={`p-4 flex items-center cursor-pointer transition-all border-b border-gray-200 ${
                            selectedMessage?.id === msg.id
                                ? "bg-slate-100 text-blue-900"
                                : "hover:bg-gray-50"
                        }`}
                    >
                        <img
                            src={
                                "https://agri-soko-2-1.vercel.app/assets/default-BeD4CxIB.jpg"
                            }
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                                {msg.sender}
                            </h4>
                            <p className="text-sm text-gray-600 truncate">
                                {msg.msg}
                            </p>
                        </div>
                        {selectedMessage?.id === msg.id && (
                            <div className="ml-2 text-green-600">
                                <i className="fas fa-check-circle"></i>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-gray-100 h-screen">
                {selectedMessage ? (
                    <>
                        {/* Header */}
                        <div className="p-4 bg-white flex items-center border-b">
                            <img
                                src={
                                    "https://agri-soko-2-1.vercel.app/assets/default-BeD4CxIB.jpg"
                                }
                                alt="Profile"
                                className="w-10 h-10 rounded-full mr-4"
                            />
                            <div>
                                <h4 className="text-lg font-semibold">
                                    {selectedMessage.sender}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    Service: {selectedMessage.service}
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {chatHistory.map((chat, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        chat.sender === "me"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`${
                                            chat.sender === "me"
                                                ? "bg-yellow-400 text-black"
                                                : "bg-white"
                                        } p-3 rounded-lg max-w-xs`}
                                    >
                                        {chat.text}
                                        <div className="flex items-center justify-between text-xs mt-2">
                                            <span className="text-slate-700">
                                                
                                            </span>
                                            {chat.sender === "me" && (
                                                <span
                                                    className={`${
                                                        chat.status ===
                                                        "Failed to send"
                                                            ? "text-red-500"
                                                            : "text-gray-400"
                                                    } flex items-center`}
                                                >
                                                    {chat.status ===
                                                    "Failed to send" ? (
                                                        <AiOutlineReload
                                                            className="ml-1 cursor-pointer"
                                                            onClick={() =>
                                                                handleRetryMessage(
                                                                    index
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        chat.status
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-white border-t flex items-center sticky bottom-0">
                            <textarea
                                className="flex-1 border rounded-lg p-2 mr-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700 resize-none"
                                rows="1"
                                placeholder="Type a message 2..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        //handleSendMessage();
                                    }
                                }}
                            ></textarea>
                            <button
                                className="bg-green-700 text-white p-3 rounded-full hover:bg-lime-700 transition-all"
                                onClick={handleSendMessage(chat.id,chat.service_id)}
                            >
                                <FiSend className="w-5 h-5" />
                            </button>
                        </div>

                                </div>
                            ))}
                        </div>

                        {/* Input Box */}
                        <div className="p-4 bg-white border-t flex items-center sticky bottom-0">
                            {/*<textarea
                                className="flex-1 border rounded-lg p-2 mr-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700 resize-none"
                                rows="1"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        //handleSendMessage();
                                    }
                                }}
                            ></textarea>*/}
                            {/*<button
                                className="bg-green-700 text-white p-3 rounded-full hover:bg-lime-700 transition-all"
                                onClick={handleSendMessage}
                            >
                                <FiSend className="w-5 h-5" />
                            </button>*/}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );
}

export default Messages;
