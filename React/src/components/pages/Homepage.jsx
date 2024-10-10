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


const Homepage = () => {
  const { setUser, setToken } = useStateContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [serverError, setServerError] = useState("");

  const token = searchParams.get('token');
  const user = JSON.parse(searchParams.get('user'));
  
  //Authenticate
  const Authenticate = () => {
        //e.preventDefault();
  const payload = {
            email: user.email,
            password: token,
        };

        try {
            const { data } = axiosClient.post("/login", payload);
            console.log("Login response data:", data);

            if (data.auth) {
                setUser(data.user);
                setToken(data.token);
                return;
            } else {
                setServerError(
                    data.message ||
                        "Login failed. Please check your credentials."
                );
            }
        } catch (err) {
            setServerError("An unexpected error occurred. Please try again.");
        }
      }

      useEffect(()=> {
        if(user)
          Authenticate();
        }, [] );
  //console.log(token);

  return (
    <div>
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