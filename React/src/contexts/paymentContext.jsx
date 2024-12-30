import { useContext, useState, useEffect, createContext } from "react";

const StateContext = createContext({
    amounts: null,
    setAmounts: () => {},
});

export const ContextProvider = ({ children }) => {
    const [amounts, _setAmounts] = useState(0);

    // Function to set amounts
    const setAmounts = (amounts) => {
        _setAmounts(amounts);
        console.log("From the context we have", amounts);
    };

    return (
        <StateContext.Provider value={{ amounts, setAmounts }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
