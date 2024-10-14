import CategoryLinks from "../partials/categorylinks"
import Footer from "../partials/footer"
import Getstarted from "../partials/Getstarted"
import Herosection from "../partials/Herosection"
import CardList from "../partials/Homecards"
import Homesearch from "../partials/Homesearch"
import HowItWorks from "../partials/Howitworks"
import Invest from "../partials/Invest"
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
        
          

        }, [] );
  //console.log(token);

  return (
    <div>
        <a id="login" onClick={Authenticate}> </a>
        <Herosection/>
        <Homesearch/>
        <CategoryLinks/>
        <CardList/>
        <HowItWorks/>
        <Invest/>
        <Getstarted/>
        

    </div>
  )
}

export default Homepage