// src/contexts/contextProvider.js
import { useContext, useState, useEffect, createContext } from "react";
import { useIdleTimer } from "react-idle-timer";
import { MessageProvider } from "../components/dashboard/Service/msgcontext";
import { v4 as uuidv4 } from 'uuid';

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
    const [networkActive, setNetworkActive] = useState(true);
    const [lastActivity, setLastActivity] = useState(Date.now());

    // Network status detection
    useEffect(() => {
        const handleOnline = () => setNetworkActive(true);
        const handleOffline = () => setNetworkActive(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Session heartbeat system
    useEffect(() => {
        if (!token) return;

        const SESSION_KEY = `SESSION_${token}`;
        const HEARTBEAT_INTERVAL = 5000; // 5 seconds
        const ACTIVITY_THRESHOLD = 10000; // 10 seconds

        // Update last activity on user interaction
        const updateActivity = () => setLastActivity(Date.now());
        window.addEventListener('mousemove', updateActivity);
        window.addEventListener('keydown', updateActivity);
        window.addEventListener('click', updateActivity);

        const checkSession = () => {
            if (!networkActive) return;

            const currentSession = {
                token,
                lastActive: Date.now(),
                sessionId: uuidv4()
            };

            // Store our activity
            localStorage.setItem(SESSION_KEY, JSON.stringify(currentSession));

            // Check for other sessions
            const allSessions = Object.entries(localStorage)
                .filter(([key]) => key.startsWith('SESSION_'))
                .map(([_, value]) => JSON.parse(value));

            // Find the most recent session with our token
            const latestSession = allSessions
                .filter(s => s.token === token)
                .sort((a, b) => b.lastActive - a.lastActive)[0];

            // If we're not the latest session, log out
            if (latestSession && latestSession.lastActive > currentSession.lastActive) {
                logout("You've been logged in from another device.");
            }

            // Clean up old sessions
            allSessions.forEach(session => {
                if (Date.now() - session.lastActive > ACTIVITY_THRESHOLD * 3) {
                    localStorage.removeItem(`SESSION_${session.token}`);
                }
            });
        };

        // Immediate check and then periodic checks
        checkSession();
        const interval = setInterval(checkSession, HEARTBEAT_INTERVAL);

        return () => {
            clearInterval(interval);
            window.removeEventListener('mousemove', updateActivity);
            window.removeEventListener('keydown', updateActivity);
            window.removeEventListener('click', updateActivity);
        };
    }, [token, networkActive]);

    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
            // Force immediate session check
            setLastActivity(Date.now());
        } else {
            logout();
        }
    };

    const setAmounts = (amounts) => {
        _setAmounts(amounts);
        console.log("From the context we have", amounts);
    };

    const logout = (message = "You've been logged out.") => {
        localStorage.removeItem("ACCESS_TOKEN");
        _setToken(null);
        setUser(null);
        setAuth(null);
        
        $.alert({
            title: "Session Ended",
            content: message,
        });
    };

    // Idle timer logic
    const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    const handleOnUserIdle = () => {
        if (token) {
            logout("You've been logged out due to inactivity.");
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