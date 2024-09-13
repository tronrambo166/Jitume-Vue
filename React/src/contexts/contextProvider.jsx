import { useContext } from "react";
import { useState } from 'react'
import { createContext } from 'react'

const StateContext = createContext({
	user:null,
	token:null,
    auth:null,
    cards:null,
    setCards: () => {},
    setAuth: () => {},
	setUser: () => {},
	setToken: () => {}
});

export const ContextProvider = ({children}) => {
	const [user, setUser] = useState({});
	const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'))
    const [auth, setAuth] = useState({});
    const [cards, setCards] = useState({});
    const [res, setRes] = useState('');
	//const [token, setToken] = useState({});

	const setToken = (token) => {
        _setToken(token)
        if(token){
            localStorage.setItem('ACCESS_TOKEN',token);
            
        }
        else{
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }

    return (
        <StateContext.Provider value={{
            user,
            token,
            setUser,
            setToken,
            setAuth,
            auth,
            cards, 
            setCards,
            res,
            setRes
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)