import { useEffect, useState, useRef } from "react";
import { AiOutlineReload } from "react-icons/ai"; // Retry icon
import { FiSend } from "react-icons/fi"; // Send icon
import axiosClient from "../../axiosClient";
import SkeletonLoader from "./SkeletonLoader";
import { FaArrowCircleLeft } from "react-icons/fa";
import { useMessage } from "../dashboard/Service/msgcontext"; // Import the custom hook
import { useLocation } from "react-router-dom";
import MessageProtection from "./MessageProtection";
import { useAlert } from "../partials/AlertContext";

function Messages() {
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatHistorySent, setChatHistorySent] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [isMobileView, setIsMobileView] = useState(false);
    const chatContainerRef = useRef(null);
    const [userId, setUserId] = useState(null);
    //const [from, setFrom] = useState(0);
    const [check, setcheck] = useState(0);
    const [customer, setCustomer] = useState(0);
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert

    const { dshmsg } = useMessage(); // Use the context to get the current message

    const { dashmsg } = useMessage(); // Correctly access the context value
    const { customer_id }  = location.state || { customer_id: 0 };
    console.log(customer_id);

    useEffect(() => {
        let isMounted = true; // Guard for fetch

        const fetchMessages = (from) => {
            if (check === 0) {
                console.log("Fetching messages..." + messages.length);
            }

            axiosClient
                .get("/business/service_messages/" + from)
                .then(({ data }) => {
                    if (isMounted) {
                        console.log("Messages fetched successfully:", data);
                        // if (messages.length === 0) {
                        //     setMessages(data.messages || []);
                        //     setcheck(1);
                        // }

                        setMessages(data.messages || []);
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    if (isMounted) {
                        console.error("Error fetching messages:", err);
                        setLoading(false);
                    }
                });
        };

        fetchMessages(0);

        if (customer_id != null || customer_id != 0) fetchUser(customer_id);

        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            isMounted = false; // Prevent updates on unmounted component
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const fetchUser = (investor_id) => {
        axiosClient
            .get("/business/fetchUser/" + investor_id)
            .then(({ data }) => {
                if (data.status == 200) {
                    setCustomer(data.user || []);
                    console.log("New User", data);
                    setMessages((oldArray) => [...oldArray, data.user]);
                    handleSelectMessage(data.user);
                } else console.log(data.messages);
            })
            .catch((err) => {
                console.error("Error fetching messages:", err);
            });
    };
    // Fetching messages from the server.
    // Setting up a listener for resizing the browser window to determine if the view is mobile.

    if (messages.length > 0 && messages[0].length > 0) {
        const latestMsg = messages[0][0].msg; // Latest message
        const latestSender = messages[0][0].sender; // Latest sender
        console.log("Latest Message:", latestMsg);
        console.log("Latest Sender:", latestSender);
    }

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    // const handleSelectMessage = (msg) => {
    //     console.log("Selected message:", msg);
    //        msg.new = 0; // Mark as read
    //        setSelectedMessage(msg);
    //     setSelectedMessage(msg);
    //     //FETCH
    //     setChatHistory([]);
    //     //setChatHistorySent([]);
    //     msg.messages.forEach((message, index) => {
    //         setChatHistory((prevArray) => [...prevArray, message]);
    //     });

    //     // setChatHistory([
    //     //   {
    //     //       sender: message.sender,
    //     //       text: message.msg, // Use 'text' to match the rendering logic
    //     //       id: message.id,
    //     //       service_id: message.service_id,
    //     //       time: message.created_at,
    //     //   },
    //     //  ]);

    //     // msg.sent.forEach((message, index) => {
    //     // setChatHistorySent(prevArray => [...prevArray, message])
    //     // });
    // };

    const handleSelectMessage = (msg) => {
        console.log("Selected message:", msg);

        // Mark the message as read
        // msg.new = 0;
        setSelectedMessage(msg);
        console.log("Something", msg.new);

        // Clear existing chat histories
        setChatHistory([]);
        // Optional: Clear chat history for sent messages
        setChatHistorySent([]);

        // Populate the chat history
        if (msg.messages && msg.messages.length > 0) {
            setChatHistory([...msg.messages]);
        }

        // Optional: Populate sent messages history
        if (msg.sent && msg.sent.length > 0) {
            setChatHistorySent([...msg.sent]);
        }
        
    };

   const handleSendMessage = (id, service_id,from_id) => {
       if (!newMessage.trim()) return;

       // Protect or encrypt the message using MessageProtection
       const protectedMessage = MessageProtection(newMessage);

       // Check if the protected message is different from the original message
       if (protectedMessage !== newMessage) {
           // If the message was altered by the protection (e.g., email or phone masked)
           showAlert(
               "info",
               "Your message contains sensitive information ."
           );
       }

       // Add a temporary timestamp when the message is sent
       const tempMessage = {
           sender: "me", // Indicate the sender is the current user
           msg: protectedMessage, // Use the protected message
           id,
           service_id,
           from_id,
           status: "Sending...", // Temporary status
           created_at: new Date().toISOString(), // Temporary timestamp
       }; 

       console.log("Sending message:", tempMessage);

       setChatHistory((prev) => [...prev, tempMessage]);

       axiosClient
           .post("/serviceReply", {
               msg_id: id,
               service_id,
               msg: protectedMessage,
               from_id:from_id, // Send the protected message to the backend
           })
           .then(({ data }) => {
               console.log("Success:", data.message);
               setChatHistory((prev) =>
                   prev.map((msg) =>
                       msg === tempMessage ? { ...msg, status: "Sent" } : msg
                   )
               );
           })
           .catch((err) => {
               showAlert(`error`, `Failed to send message: ${err}`);
               setChatHistory((prev) =>
                   prev.map((msg) =>
                       msg === tempMessage
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
            showAlert("info", `Retrying message: ${message}`);

            // Protect or encrypt the message before retrying
            const protectedMessage = MessageProtection(message.msg);

            setChatHistory((prev) =>
                prev.map((msg, idx) =>
                    idx === index ? { ...msg, status: "Sending..." } : msg
                )
            );

            axiosClient
                .post("/serviceReply", { msg: protectedMessage }) // Send the protected message
                .then(() => {
                    showAlert("success", "Message sent successfully");
                    setChatHistory((prev) =>
                        prev.map((msg, idx) =>
                            idx === index ? { ...msg, status: "Sent" } : msg
                        )
                    );
                })
                .catch((err) => {
                    showAlert("error", `Failed to resend message: ${err}`);
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

    //

    useEffect(() => {
        console.log("Current message:", dashmsg); // Log the message when it changes

        if (dashmsg != null) {
            // Use regex to extract User ID from dashmsg
            const userIdMatch = dashmsg.match(/\(User ID: (\d+)\)/);

            if (userIdMatch) {
                // Extracted userId from the message
                const user_id = userIdMatch[1];
                console.log("Extracted User ID:", user_id);

                setUserId(user_id); // Save the extracted User ID separately
            }

            // Remove User ID from the message
            const modifiedMessage = dashmsg.replace(/\(User ID: \d+\)/, ""); // Cleaned message

            setNewMessage(modifiedMessage); // Update newMessage with cleaned text
        }
    }, [dashmsg]);

    //
    if (loading) return <SkeletonLoader />;

    return (
        <div className="flex mt-6 px-6 flex-col md:flex-row text-gray-800 relative mx-auto h-[700px] bg-gray-50 shadow-lg">
            {/* Sidebar */}
            <div
                className={`w-full md:w-1/3 bg-white border-r overflow-y-auto ${
                    isMobileView && selectedMessage ? "hidden" : ""
                }`}
            >
                <div className="p-4 border-b bg-white mt-6 sm:mt-0">
                    <hr className="border-t border-gray-300 mb-4 sm:hidden"></hr>

                    <h3 className="text-lg mb-[13px] font-bold">
                        Conversations
                    </h3>
                </div>
                {messages
                    .sort((a, b) => {
                        const isNewA = a.new === 1 ? 1 : 0;
                        const isNewB = b.new === 1 ? 1 : 0;

                        if (isNewA !== isNewB) {
                            return isNewB - isNewA; // Prioritize new messages first
                        }

                        // If both messages have the same 'new' status, sort by the latest timestamp
                        const lastMsgA = a.messages?.length
                            ? new Date(
                                  a.messages[a.messages.length - 1].created_at
                              )
                            : new Date(0); // Default to a very old date if no messages exist
                        const lastMsgB = b.messages?.length
                            ? new Date(
                                  b.messages[b.messages.length - 1].created_at
                              )
                            : new Date(0); // Default to a very old date if no messages exist

                        return lastMsgB - lastMsgA; // Show the latest message first
                    })
                    .map((msg) => (
                        <div
                            key={msg.id}
                            onClick={() => handleSelectMessage(msg)}
                            className={`p-4 flex items-center cursor-pointer border-b ${
                                selectedMessage?.id === msg.id
                                    ? "bg-slate-100 text-blue-900"
                                    : "hover:bg-gray-50"
                            }`}
                        >
                            <img
                                src={
                                    msg.avatarUrl ||
                                    "https://agri-soko-2-1.vercel.app/assets/default-BeD4CxIB.jpg"
                                }
                                alt="Profile"
                                className="w-12 h-12 rounded-full object-cover mr-4"
                            />
                            <div className="flex-1">
                                <h4 className="font-semibold">{msg.sender}</h4>
                                <p
                                    className={`text-sm ${
                                        msg.messages &&
                                        msg.messages[0] &&
                                        msg.messages[0].new === 1
                                            ? "bg-green-500 bg-opacity-20 text-black font-medium shadow-lg backdrop-blur-md border border-green-300 rounded-lg p-3 pr-16"
                                            : "text-gray-600"
                                    }`}
                                    style={{
                                        maxWidth: "200px",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {msg.messages &&
                                        msg.messages[0] &&
                                        msg.messages[0].new === 1 && (
                                            <span className="absolute top-1 right-2 font-semibold text-xs text-green-600 animate-pulse">
                                                New
                                            </span>
                                        )}
                                    {msg.messages && msg.messages.length > 0
                                        ? msg.messages[0].msg
                                        : "No messages yet"}
                                </p>
                            </div>
                            {/* Show unread message count */}
                            {/* {msg.new === 1 && (
                                <span className="ml-2 text-xs text-white bg-red-500 rounded-full px-2 py-1">
                                    {msg.new}
                                </span>
                            )} */}
                        </div>
                    ))}
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-gray-100 h-[700px]">
                {selectedMessage ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 bg-white fixed-top w-full z-50 flex items-center border-b">
                            <button
                                onClick={() => setSelectedMessage(null)} // Reset selectedMessage to null
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

                        {/* Chat History */}
                        <div
                            className="flex-1 p-4 overflow-y-auto"
                            ref={chatContainerRef}
                            style={{
                                flexGrow: 1,
                                overflowY: "auto",
                            }}
                        >
                            {messages.length > 0 ? (
                                chatHistory
                                    .slice()
                                    .reverse()
                                    .map((chat, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${
                                                chat.sender === "me"
                                                    ? "justify-end"
                                                    : "justify-start"
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
                                                <p className="text-sm leading-relaxed">
                                                    {chat.msg}
                                                </p>
                                                <small className="text-gray-500 dark:text-gray-400 text-xs mt-2 block">
                                                    {new Date(
                                                        chat.created_at
                                                    ).toLocaleString()}
                                                </small>
                                                {chat.sender === "me" &&
                                                    chat.status ===
                                                        "Failed to send" && (
                                                        <button
                                                            className="text-blue-500 text-xs flex items-center space-x-1 mt-2"
                                                            onClick={() =>
                                                                handleRetryMessage(
                                                                    index
                                                                )
                                                            } // Pass the correct index to the function
                                                        >
                                                            <AiOutlineReload className="w-4 h-4" />
                                                            <span>Resend</span>
                                                        </button>
                                                    )}
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <div className="text-center text-gray-400 mt-4">
                                    No messages yet. Say hello!
                                </div>
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="p-4  border-t flex items-center fixed-bottom-0 bg-white z-10 shadow-lg">
                            <textarea
                                className="flex-1 border rounded-lg p-1 sm:p-2 mr-2 sm:mr-3 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 shadow-sm placeholder-gray-400 resize-none text-sm sm:text-base align-top transition-all duration-200 ease-in-out"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                style={{
                                    minHeight: "48px", // Smaller height for mobile
                                    maxHeight: "120px", // Limit resizing height
                                    overflowY: "auto", // Allow scrolling for long text
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault(); // Prevent newline
                                        handleSendMessage(
                                            selectedMessage.id,
                                            selectedMessage.service_id,
                                            selectedMessage.from_id
                                        );
                                    }
                                }}
                            ></textarea>

                            <button
                                className="bg-green-700 text-white p-3 rounded-full hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
                                onClick={() =>
                                    handleSendMessage(
                                        selectedMessage.id,
                                        selectedMessage.service_id,
                                        selectedMessage.from_id
                                    )
                                }
                            >
                                <FiSend className="w-5 h-5" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 hidden md:flex items-center justify-center text-gray-500">
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );
}

export default Messages;
