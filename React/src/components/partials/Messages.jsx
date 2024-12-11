import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import SkeletonLoader from "./SkeletonLoader";

function Messages() {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true); // Add loading state
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        const getUser = () => {
            axiosClient
                .get("/business/service_messages")
                .then(({ data }) => {
                    setMessages(data.messages);
                    setLoading(false); // Set loading to false when data is fetched
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false); // Set loading to false even if there's an error
                });
        };
        getUser();

        // Check for mobile view
        const checkMobileView = () => {
            if (window.innerWidth < 768) {
                setIsMobileView(true);
            } else {
                setIsMobileView(false);
            }
        };
        checkMobileView();
        window.addEventListener("resize", checkMobileView);
        return () => window.removeEventListener("resize", checkMobileView);
    }, []);

    const handleSelectMessage = (message) => {
        setSelectedMessage(message);
        // Initialize chat history with the selected message
        setChatHistory([
            { sender: "them", text: message.msg, time: message.created_at },
        ]);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        // Temporarily set status as "Sending..." until confirmed sent
        const tempMessage = {
            sender: "me",
            text: newMessage,
            time: new Date().toLocaleString("en-US", {
                weekday: "long", // e.g., "Wednesday"
                year: "numeric", // e.g., "2024"
                month: "long", // e.g., "September"
                day: "numeric", // e.g., "11"
                hour: "numeric", // e.g., "12"
                minute: "2-digit", // e.g., "39"
                hour12: true, // e.g., "AM/PM"
            }),
            status: "Sending...",
        };

        setChatHistory((prevHistory) => [...prevHistory, tempMessage]);

        // Simulate sending a message
        axiosClient
            .post("/send_message", { message: newMessage })
            .then(() => {
                // Update the status to "Sent"
                setChatHistory((prevHistory) =>
                    prevHistory.map((chat, index) =>
                        index === prevHistory.length - 1
                            ? { ...chat, status: "Sent" }
                            : chat
                    )
                );
            })
            .catch(() => {
                // Handle sending error (optional)
                setChatHistory((prevHistory) =>
                    prevHistory.map((chat, index) =>
                        index === prevHistory.length - 1
                            ? { ...chat, status: "Failed to send" }
                            : chat
                    )
                );
            });

        setNewMessage(""); // Clear the input
    };

    const handleBackToConversations = () => {
        setSelectedMessage(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) {
            // If the date is invalid, return a default or custom message
            return "Invalid Date";
        }
        return date.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    if (loading) {
        // Display SkeletonLoader while loading
        return <SkeletonLoader />;
    }

    return (
        <div className="flex flex-col mt-4 rounded-lg md:flex-row h-[90vh]">
            {/* Conversations List - Mobile Drawer */}
            <div
                className={`w-full md:w-1/3 bg-gray-100 border-r overflow-y-auto ${
                    isMobileView && selectedMessage ? "hidden" : ""
                }`}
            >
                <h3 className="text-lg font-semibold p-3 border-b">
                    Conversations
                </h3>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        onClick={() => handleSelectMessage(msg)}
                        className={`p-3 border-b cursor-pointer ${
                            selectedMessage?.id === msg.id
                                ? "bg-green-100"
                                : "hover:bg-gray-200"
                        }`}
                    >
                        <h4 className="font-semibold text-sm">{msg.sender}</h4>
                        <p className="text-xs text-gray-600 truncate">
                            {msg.msg}
                        </p>
                    </div>
                ))}
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedMessage ? (
                    <>
                        {/* Mobile Back Button */}
                        {isMobileView && (
                            <button
                                onClick={handleBackToConversations}
                                className="p-3 bg-gray-200 text-gray-800 rounded-t-lg"
                            >
                                Back to Conversations
                            </button>
                        )}

                        {/* Chat Header */}
                        <div className="p-3 bg-gray-100 border-b">
                            <h4 className="text-md font-semibold">
                                {selectedMessage.sender}
                            </h4>
                            <p className="text-xs text-gray-500">
                                Related to: {selectedMessage.service}
                            </p>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50">
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
                                                ? "bg-green text-white"
                                                : "bg-gray-100"
                                        } p-4 max-w-xs shadow-lg relative rounded-xl transform transition-all duration-200 ease-in-out hover:scale-105`}
                                    >
                                        {chat.text}
                                        <p className="text-xs text-gray-400 mt-1 text-right">
                                            {formatDate(chat.time)}
                                        </p>

                                        {chat.sender === "me" &&
                                            chat.status && (
                                                <p className="text-xs text-white mt-1">
                                                    {chat.status}
                                                </p>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <div className="p-3 border-t bg-white">
                            <textarea
                                rows="2"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green focus:border-green text-gray-500 resize-none"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault(); // Prevent new line on Enter
                                        handleSendMessage(); // Send message when Enter is pressed
                                    }
                                }}
                            ></textarea>
                            <button
                                className="mt-2 w-full bg-green text-white py-2 rounded-lg btn-primary transition-colors"
                                onClick={handleSendMessage}
                            >
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    // Only show this message on desktop
                    !isMobileView && (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Select a conversation to start chatting
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default Messages;

// import { useEffect, useState } from 'react';
// import axiosClient from "../../axiosClient";

// function Messages() {
//   const [messages, setMessages] = useState([]);

//   const [selectedMessage, setSelectedMessage] = useState(null);

//   useEffect(() => {
//     const getUser = () => {
//       axiosClient.get('/business/service_messages')
//         .then(({ data }) => {
//           setMessages(data.messages);
//           console.log(messages);

//         })
//         .catch(err => {
//           console.log(err);
//         });
//     };
//     getUser();
//   }, []);

//   const handleReply = (message) => {
//     setSelectedMessage(message);
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h3 className="text-left text-2xl font-semibold mb-6">Messages</h3>
//       <div className="overflow-x-auto shadow-md sm:rounded-lg">
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead className="bg-gray-100 border-b border-gray-200">
//             <tr className='text-gray-700'>
//               <th className="text-left py-3 px-4 uppercase font-semibold text-sm">From</th>
//               <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Related Service</th>
//               <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Message</th>
//               <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Time</th>
//               <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Reply</th>
//             </tr>
//           </thead>
//           <tbody>
//             {messages.map((msg) => (
//               <tr key={msg.id} className="text-gray-700 hover:bg-gray-50 transition-colors">
//                 <td className="py-3 px-4 border-b">{msg.sender}</td>
//                 <td className="py-3 px-4 border-b">{msg.service}</td>
//                 <td className="py-3 px-4 border-b">{msg.msg}</td>
//                 <td className="py-3 px-4 border-b">{msg.created_at}</td>
//                 <td className="py-3 px-4 border-b text-center">
//                   <button
//                     onClick={() => handleReply(msg)}
//                     className="text-blue-600 hover:underline focus:outline-none"
//                   >
//                     Reply
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal for replying to a message */}
//       {selectedMessage && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
//           <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg mx-auto relative">
//             <button
//               onClick={() => setSelectedMessage(null)}
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//             >
//               <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//               </svg>
//             </button>
//             <h4 className="text-2xl font-semibold mb-6">Reply to Message</h4>
//             <p className="mb-4"><strong>From:</strong> {selectedMessage.from}</p>
//             <p className="mb-4"><strong>Message:</strong> {selectedMessage.message}</p>
//             <textarea
//               rows="4"
//               className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter your message..."
//             ></textarea>
//             <div className='flex justify-end'>
//               <button
//                 onClick={() => setSelectedMessage(null)}
//                 className='btn-primary py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors'
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Messages;
