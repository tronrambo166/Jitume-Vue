// src/contexts/contextProvider.js
import { useContext, useState, useEffect, createContext } from "react";
import { useIdleTimer } from "react-idle-timer";

const StateContext = createContext({
    user: null,
    token: null,
    auth: null,
    cards: null,
    setCards: () => {},
    setAuth: () => {},
    setUser: () => {},
    setToken: () => {},
});

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
    const [auth, setAuth] = useState({});
    const [cards, setCards] = useState({});
    const [res, setRes] = useState("");

    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    useEffect(() => {
        // Check if 20 seconds have elapsed since last tab close
        const checkTokenExpiry = () => {
            const logoutTime = localStorage.getItem("LOGOUT_TIME");
            const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

            if (logoutTime) {
                const elapsed = Date.now() - parseInt(logoutTime, 10);

                // If 20+ seconds have passed, clear token and reset state
                if (elapsed >= fiveMinutes) {
                    localStorage.removeItem("ACCESS_TOKEN");
                    localStorage.removeItem("LOGOUT_TIME");
                    setUser(null);
                    setAuth(null);
                    setToken(null);
                }
            }
        };

        // Save the timestamp when the tab is closed
        const handleTabClose = () => {
            const logoutTime = Date.now();
            localStorage.setItem("LOGOUT_TIME", logoutTime);
        };

        // When the app starts/reopens, check if the token should be removed
        checkTokenExpiry();

        // Add listeners for tab close
        window.addEventListener("beforeunload", handleTabClose);

        return () => {
            window.removeEventListener("beforeunload", handleTabClose);
        };
    }, []);

    // Idle timer logic
    const TEN_SECONDS = 30 * 60 * 1000; // Idle timeout (10 seconds for testing) 5min
    const DEBOUNCE_TIME = 1000; // Wait 1 second before checking idle state

    const handleOnUserIdle = () => {
        if (token && token !== "false") {
            localStorage.clear(); // Clear stored session data
            localStorage.setItem("userLoggedOut", "true"); // Set a flag for logged out
            setToken(null);
            $.alert({
                title: "Please Log In!",
                content: "You're Logged Out.",
            });
        }
    };

    useIdleTimer({
        timeout: TEN_SECONDS, // Set to 10 seconds for accurate idle detection
        onIdle: handleOnUserIdle,
        debounce: DEBOUNCE_TIME, // 1 second debounce time to prevent premature triggering
        enabled: !!token && token !== "false", // Only enable if the user is logged in
    });

    return (
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
                res,
                setRes,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
