import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useMessage } from "../dashboard/Service/msgcontext";
import { useAlert } from "../partials/AlertContext";
import axiosClient from "../../axiosClient";
import ConversationsList from "./ConversationsList";
import ChatWindow from "./ChatWindow";
import SkeletonLoader from "./SkeletonLoader";
import useMessageProtection from "./MessageProtectionService";

function Messages() {
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatHistorySent, setChatHistorySent] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [isMobileView, setIsMobileView] = useState(false);
    const [userId, setUserId] = useState(null);
    const [check, setCheck] = useState(0);
    const [customer, setCustomer] = useState(0);

    const { showAlert } = useAlert();
    const { dshmsg, dashmsg } = useMessage();
    const { customer_id } = location.state || { customer_id: 0 };

    const chatContainerRef = useRef(null);
    const { processMessage } = useMessageProtection(showAlert);

    useEffect(() => {
        let isMounted = true;

        const fetchMessages = async (from) => {
            if (check === 0) {
                console.log("Fetching messages..." + messages.length);
            }

            try {
                const { data } = await axiosClient.get(
                    "/business/service_messages/" + from
                );
                if (isMounted) {
                    console.log("Messages fetched successfully:", data);
                    setMessages(data.messages || []);

                    // After fetching messages, check if we need to fetch a specific user
                    if (customer_id != null && customer_id != 0) {
                        await fetchUser(customer_id, data.messages || []);
                    }

                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error fetching messages:", err);
                    setLoading(false);
                }
            }
        };

        fetchMessages(0);

        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            isMounted = false;
            window.removeEventListener("resize", handleResize);
        };
    }, [customer_id]); // Add customer_id as dependency

    const fetchUser = async (investor_id, existingMessages = []) => {
        try {
            const { data } = await axiosClient.get(
                "/business/fetchUser/" + investor_id
            );

            if (data.status == 200 && data.user) {
                console.log("New User", data);

                // Check if user already exists in messages to avoid duplication
                const userExists = existingMessages.find(
                    (msg) => msg.id === data.user.id
                );

                if (!userExists) {
                    setMessages((oldArray) => {
                        // Double check to avoid race conditions
                        const userAlreadyExists = oldArray.find(
                            (msg) => msg.id === data.user.id
                        );
                        if (userAlreadyExists) {
                            return oldArray;
                        }
                        return [...oldArray, data.user];
                    });
                }

                // Always select the user regardless of whether they were added
                setCustomer(data.user);
                handleSelectMessage(data.user);

                // Set the initial message if it exists
                if (dashmsg) {
                    setNewMessage(dashmsg);
                }
            } else {
                console.log(data.messages);
            }
        } catch (err) {
            console.error("Error fetching user:", err);
            showAlert("error", "Failed to fetch user information");
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleSelectMessage = (msg) => {
        console.log("Selected message:", msg);
        setSelectedMessage(msg);

        setChatHistory([]);
        setChatHistorySent([]);

        if (msg.messages && msg.messages.length > 0) {
            setChatHistory([...msg.messages]);
        }

        if (msg.sent && msg.sent.length > 0) {
            setChatHistorySent([...msg.sent]);
        }
    };

    const handleSendMessage = (id, service_id, from_id) => {
        if (!newMessage.trim()) return;

        console.log("Processing message through protection service...");

        // Use the message protection service for all outgoing messages
        processMessage(
            newMessage,
            id,
            service_id,
            customer_id ? id : from_id,
            sendMessageToBackend
        );
    };

    const sendMessageToBackend = (
        protectedMessage,
        id,
        service_id,
        from_id
    ) => {
        const to_id = customer_id ? id : from_id;

        // Create temporary message object to show in UI
        const tempMessage = {
            sender: "me",
            msg: protectedMessage,
            id,
            service_id,
            to_id,
            status: "Sending...",
            created_at: new Date().toISOString(),
        };

        console.log("Sending message:", tempMessage);
        setChatHistory((prev) => [...prev, tempMessage]);

        axiosClient
            .post("/serviceReply", {
                msg_id: id,
                service_id: service_id,
                msg: protectedMessage,
                to_id: to_id,
            })
            .then(({ data }) => {
                console.log("Message sent successfully:", data);
                setChatHistory((prev) =>
                    prev.map((msg) =>
                        msg === tempMessage ? { ...msg, status: "Sent" } : msg
                    )
                );
                setNewMessage(""); // Clear message input after successful send
            })
            .catch((err) => {
                showAlert("error", `Failed to send message: ${err}`);
                setChatHistory((prev) =>
                    prev.map((msg) =>
                        msg === tempMessage
                            ? { ...msg, status: "Failed to send" }
                            : msg
                    )
                );
            });
    };

    const handleRetryMessage = (index) => {
        const message = chatHistory[index];
        if (message.status === "Failed to send") {
            showAlert("info", `Retrying message: ${message.msg}`);

            setChatHistory((prev) =>
                prev.map((msg, idx) =>
                    idx === index ? { ...msg, status: "Sending..." } : msg
                )
            );

            // Use the message protection service for retry as well
            processMessage(
                message.msg,
                message.id,
                message.service_id,
                message.to_id,
                sendMessageToBackend
            );
        }
    };

    useEffect(() => {
        console.log("Current message:", dashmsg);

        if (dashmsg != null) {
            const userIdMatch = dashmsg.match(/\(User ID: (\d+)\)/);

            if (userIdMatch) {
                const user_id = userIdMatch[1];
                console.log("Extracted User ID:", user_id);
                setUserId(user_id);
            }

            const modifiedMessage = dashmsg.replace(/\(User ID: \d+\)/, "");
            setNewMessage(modifiedMessage);
        }
    }, [dashmsg]);

    if (loading) return <SkeletonLoader />;

    return (
        <div className="flex mt-6 px-6 flex-col md:flex-row text-gray-800 relative mx-auto h-[700px] bg-gray-50 shadow-lg">
            {/* Sidebar - Conversations List */}
            <ConversationsList
                messages={messages}
                selectedMessage={selectedMessage}
                isMobileView={isMobileView}
                onSelectMessage={handleSelectMessage}
            />

            {/* Chat Window */}
            <ChatWindow
                selectedMessage={selectedMessage}
                chatHistory={chatHistory}
                newMessage={newMessage}
                chatContainerRef={chatContainerRef}
                onMessageChange={setNewMessage}
                onSendMessage={handleSendMessage}
                onRetryMessage={handleRetryMessage}
                onBackClick={() => setSelectedMessage(null)}
            />
        </div>
    );
}

export default Messages;
