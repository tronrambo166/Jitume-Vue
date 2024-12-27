import React, { useState, useEffect, useRef } from "react";
import { FaRobot, FaUser, FaPaperPlane } from "react-icons/fa";

const LivechatBox = () => {
    const getMainMenuText = () => {
        return `Main Menu:\n1: "What is Jitume?"\n2: "How does Jitume work?"\n3: "Why invest with Jitume?"\n4: "Key Features for Investors"\n5: "How to Evaluate Opportunities"\n6: "Frequently Asked Questions"\n\nReply with the number of your choice.`;
    };

    const [messages, setMessages] = useState([
        {
            sender: "AI",
            text: "Welcome to Jitume Chatbot! How can I assist you today?",
        },
        { sender: "AI", text: getMainMenuText() },
    ]);
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        setMessages((prev) => [...prev, { sender: "You", text: input }]);

        setIsTyping(true);
        const botReply = getBotReply(input.trim());
        setTimeout(() => {
            if (botReply) {
                setMessages((prev) => [
                    ...prev,
                    { sender: "AI", text: botReply },
                ]);
            }
            setIsTyping(false);
        }, 3000);

        setInput("");
    };

    const getBotReply = (userInput) => {
        const lowercaseInput = userInput.toLowerCase();

        const responses = {
            1: `**What is Jitume?**
Jitume is a platform that connects investors with vetted businesses seeking funding. By fostering a secure and transparent investment ecosystem, Jitume ensures both investors and entrepreneurs achieve their goals.

Would you like to know more about:
- Jitume's Mission (type 'mission')
- Founding Story (type 'story')
- Key Benefits (type 'benefits')?

Type "menu" to return to the Main Menu.`,

            2: `**How does Jitume work?**
Jitume uses a milestone-based escrow system:
- Businesses propose projects and set milestones.
- Investors fund projects in phases.
- Funds are released when milestones are achieved.

Would you like to learn about:
- Types of Milestones (type 'milestones')
- Security Features (type 'security')
- Investor Protections (type 'protections')?

Type "menu" to return to the Main Menu.`,

            // other responses remain unchanged...

            mission: `**Jitume's Mission**
Our mission is to bridge the gap between investors and high-potential businesses, fostering economic growth and empowerment through secure, transparent, and impactful investments.

Type "menu" to return to the Main Menu.`,

            story: `**Founding Story**
Jitume was founded by a group of passionate entrepreneurs who saw a need for a safer, more transparent way for investors and businesses to collaborate. Since its inception, Jitume has facilitated millions in successful funding!

Type "menu" to return to the Main Menu.`,

            benefits: `**Key Benefits of Jitume**
- Access to vetted, high-quality opportunities.
- Reduced risk through milestone-based funding.
- Empowerment to drive growth in impactful industries.

Type "menu" to return to the Main Menu.`,

            menu: getMainMenuText(),
        };

        return (
            responses[userInput.trim()] ||
            `I'm sorry, I didn't understand that. Please reply with a number, or type "menu" to return to the Main Menu.`
        );
    };

    return (
        <div>
            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 z-50 inline-flex items-center justify-center text-sm font-medium border rounded-full w-16 h-16 bg-green shadow-lg hover:shadow-xl transform hover:scale-105 text-white transition-all duration-300"
                type="button"
            >
                <FaRobot size={30} />
            </button>

            {/* Chat Box */}
            {isOpen && (
                <div className="fixed bottom-24 right-8 z-50 bg-white rounded-lg shadow-xl border border-gray-200 w-[400px] max-h-[600px] flex flex-col">
                    {/* Header */}
                    <div className="p-4 bg-green text-white rounded-t-lg">
                        <h2 className="font-semibold text-lg">
                            Jitume Chatbot
                        </h2>
                        <p className="text-sm">Ask me anything about Jitume!</p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex gap-3 ${
                                    msg.sender === "You" ? "justify-end" : ""
                                }`}
                            >
                                {msg.sender === "AI" && (
                                    <FaRobot className="text-green w-8 h-8" />
                                )}
                                <div
                                    className={`p-3 rounded-lg ${
                                        msg.sender === "You"
                                            ? "bg-green text-white"
                                            : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    <p className="text-sm font-medium">
                                        {msg.sender}
                                    </p>
                                    {msg.text.split("\n").map((line, idx) => (
                                        <span key={idx}>
                                            {line}
                                            <br />
                                        </span>
                                    ))}
                                </div>
                                {msg.sender === "You" && (
                                    <FaUser className="text-green w-8 h-8" />
                                )}
                            </div>
                        ))}

                        {/* Typing Animation */}
                        {isTyping && (
                            <div className="flex gap-3">
                                <FaRobot className="text-green w-8 h-8" />
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef}></div>
                    </div>

                    {/* Input */}
                    <form
                        className="flex items-center p-4 border-t border-gray-200"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                    >
                        <input
                            className="flex-1 rounded-full border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={handleSend}
                            className="ml-2 p-2 bg-green text-white rounded-full hover:bg-green-light transition-all"
                        >
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default LivechatBox;
