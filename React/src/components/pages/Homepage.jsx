import HowItWorks from "../Landing-page/How-it-works"
import Explore from "../Landing-page/Explore(1)"
import Footer from "../Landing-page/Footer"
import Invest from "../Landing-page/Invest(3)(1)"
import Topsection from "../Landing-page/Topsection"
import WhyChoose from "../Landing-page/WhyChoose(1)(1)"
import ScrollToTop from "./ScrollToTop"; 

import { useStateContext } from "../../contexts/contextProvider";
import { useLocation, useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from "react";
import axiosClient from "../../axiosClient";

const Homepage = () => {
  const { setUser, setToken } = useStateContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [serverError, setServerError] = useState("");

  const token = searchParams.get('token');
  var user1 = searchParams.get('user');
  const user = JSON.parse(user1);
  
  //Authenticate
  const Authenticate = async (e) => {
        if (e) e.preventDefault();

        let email = user.email;
        if(!email) 
        email = user[0].email;

        const payload = {
            email: email,
            password: token,
            browserLoginCheck:1,
        };

        try {
            const { data } = await axiosClient.post("/login", payload);
            console.log("Login response data:", data);
            

            if (data.auth) {
                setUser(data.user);
                setToken(data.token);

            } else {
                
                setServerError(
                    data.message ||
                        "Login failed. Please check your credentials."
                );
            }
        } catch (err) {
            console.log(err);
            setServerError("An unexpected error occurred. Please try again.");
        }
      }

      useEffect(()=> {
        if(token){
            var link=document.createElement("a");
            link.id = 'login'; //give it an ID!
            document.getElementById('login').click();    
        }
        
        //PayStack Callback
            const PayStackCallback = (e) => {
            if (e) e.preventDefault();
            //...
            }
        
          

        }, [] );

  return (
      <div>
      <a id="login" onClick={Authenticate}> </a>
          {/*<Topsection/>*/}
          <Invest />
          <WhyChoose />
          <Explore />
          <HowItWorks />
          <ScrollToTop />
          {/*<Footer/> */}
      </div>
  );
}

export default Homepage