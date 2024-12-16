import { useContext } from "react";
import { useState, useEffect } from "react";
import { createContext } from "react";

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
        const handleTabClose = () => {
            localStorage.removeItem("ACCESS_TOKEN");
            setUser(null);
            setAuth(null);
        };

        // Check if the tab was closed previously
        if (!localStorage.getItem("TAB_ACTIVE")) {
            handleTabClose();
        }

        // Mark tab as active
        localStorage.setItem("TAB_ACTIVE", "true");

        window.addEventListener("unload", () => {
            localStorage.removeItem("TAB_ACTIVE");
        });

        return () => {
            localStorage.removeItem("TAB_ACTIVE");
            window.removeEventListener("unload", () => {
                localStorage.removeItem("TAB_ACTIVE");
            });
        };
    }, []);

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
