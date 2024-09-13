import axios from "axios";
import { useRef } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextProvider";

export default function login(){
	const emailRef = useRef();
	const passwordRef = useRef();
	const {setUser, setToken} = useStateContext();

	const Submit = (e) =>{
		e.preventDefault();
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }
        axiosClient.post("/login",payload).then(({data})=>{
            console.log(data);
            setUser(data.user);
            setToken(data.token);
            
    }).catch(err => { console.log(err);
        const response = err.response;
        if(response && response.status === 422){
            console.log(response.data.errors);
        }
        console.log(err);

    });
	}

	return (
	 <div className="login-signup-form animated fadeinDown">
            <div className="form">
                <h1 className="title">
                    Login To Your Account
                </h1>
                <form onSubmit={Submit}>
                <input ref={emailRef} type="email" placeholder="Email" />
                    <input ref={passwordRef} type="password" placeholder="Password" />
                    <button className="btn btn-block">Login</button>
                    <p className="message">
                        Not Registered? <Link to= '/register'>Create a new account</Link>
                    </p>
                </form>
            </div>
        </div>
	)
};