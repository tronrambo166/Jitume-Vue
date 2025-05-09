// src/contexts/contextProvider.js
import { useContext, useState, useEffect, createContext } from "react";
import { useIdleTimer } from "react-idle-timer";
import { MessageProvider } from "../components/dashboard/Service/msgcontext";

const StateContext = createContext({
    user: null,
    token: null,
    auth: null,
    cards: null,
    setCards: () => {},
    setAuth: () => {},
    setUser: () => {},
    setToken: () => {},
    listing_id: null,
    amounts: null,
    purpose: null,
    percent: null,
    setListing_id: () => {},
    setAmounts: () => {},
    setPurpose: () => {},
    setPercent: () => {},
});

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
    const [auth, setAuth] = useState({});
    const [cards, setCards] = useState({});
    const [amounts, _setAmounts] = useState(0);
    const [listing_id, setListing_id] = useState({});
    const [purpose, setPurpose] = useState({});
    const [percent, setPercent] = useState({});
    const [sessionId, setSessionId] = useState(localStorage.getItem("SESSION_ID") || generateSessionId());

    // Generate a unique session ID
    function generateSessionId() {
        const id = 'session_' + Math.random().toString(36).substr(2, 16) + '_' + Date.now();
        localStorage.setItem("SESSION_ID", id);
        return id;
    }

    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
            // Store session info when setting token
            updateSessionInfo();
            // Start checking for session conflicts
            startSessionCheck();
        } else {
            clearSession();
        }
    };

    const setAmounts = (amounts) => {
        _setAmounts(amounts);
        console.log("From the context we have", amounts);
    };

    // Session management
    const updateSessionInfo = () => {
        const sessionInfo = {
            id: sessionId,
            lastActive: Date.now(),
            token: localStorage.getItem("ACCESS_TOKEN"),
        };
        localStorage.setItem("ACTIVE_SESSION", JSON.stringify(sessionInfo));
    };

    const clearSession = () => {
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("ACTIVE_SESSION");
        stopSessionCheck();
        setUser(null);
        setAuth(null);
    };

    // Session check interval
    let sessionCheckInterval = null;

    const startSessionCheck = () => {
        // Check every 3 seconds for session conflicts
        sessionCheckInterval = setInterval(() => {
            const storedSession = localStorage.getItem("ACTIVE_SESSION");
            
            if (!storedSession) return;
            
            const parsedSession = JSON.parse(storedSession);
            
            // If another session has taken over
            if (parsedSession.id !== sessionId) {
                // Check if the other session is newer
                if (parsedSession.lastActive > Date.now() - 5000) { // 5-second grace period
                    handleSessionConflict();
                }
            } else {
                // Update our session activity
                updateSessionInfo();
            }
        }, 3000);
    };

    const stopSessionCheck = () => {
        if (sessionCheckInterval) {
            clearInterval(sessionCheckInterval);
            sessionCheckInterval = null;
        }
    };

    const handleSessionConflict = () => {
        stopSessionCheck();
        clearSession();
        $.alert({
            title: "Session Ended",
            content: "You've been logged out because you logged in from another device.",
        });
    };

    useEffect(() => {
        // Initialize session check if token exists
        if (token) {
            updateSessionInfo();
            startSessionCheck();
        }

        // Clean up on unmount
        return () => {
            stopSessionCheck();
        };
    }, [token, sessionId]);

    // Idle timer logic
    const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    const handleOnUserIdle = () => {
        if (token) {
            clearSession();
            $.alert({
                title: "Session Expired",
                content: "You've been logged out due to inactivity.",
            });
        }
    };

    useIdleTimer({
        timeout: IDLE_TIMEOUT,
        onIdle: handleOnUserIdle,
        debounce: 1000,
        enabled: !!token,
    });

    return (
        <MessageProvider>
            <StateContext.Provider
                value={{
                    user,
                    token,
                    setUser,
                    setToken,
                    setAuth,
                    auth,
                    cards,
                    setCards,
                    listing_id,
                    amounts,
                    purpose,
                    percent,
                    setListing_id,
                    setAmounts,
                    setPurpose,
                    setPercent,
                }}
            >
                {children}
            </StateContext.Provider>
        </MessageProvider>
    );
};

export const useStateContext = () => useContext(StateContext);