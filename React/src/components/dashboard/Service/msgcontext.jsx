import React, { createContext, useState, useContext } from "react";

// Create the context
const MessageContext = createContext();

// Provider component to wrap around the app or components that need access to the message
export const MessageProvider = ({ children }) => {
    const [dashmsg, setdashmsg] = useState("");

    return (
        <MessageContext.Provider value={{ dashmsg, setdashmsg }}>
            {children}
        </MessageContext.Provider>
    );
};

// Custom hook to use the message context
export const useMessage = () => {
    return useContext(MessageContext);
};
