import { Outlet, useLocation } from "react-router-dom";
import { useStateContext } from "../contexts/contextProvider";
import axiosClient from "../axiosClient";
import Topsection from "./Landing-page/Topsection";
import Footer from "./Landing-page/Footer";
import Footer2 from "./Landing-page/global/Footer2";
import Navbar from "./Landing-page/Navbar";
import Nav2 from "./Landing-page/global/Nav2";
// import BusinessHero from "../components/Businesses/BusinessHero";
import NavbarGuest from "./partials/NavbarGuest";
import Navbar_old from "./partials/Navbar";
import PaymentHero from "./Heros/PaymentHero";
import { useIdleTimer } from "react-idle-timer";

export default function DefaultLayout() {
    const { token, setToken } = useStateContext();
    const location = useLocation();
    const isDashboardRoute = location.pathname.startsWith("/dashboard");
    const isHome = location.pathname === "/home";

    // Check if the current path should use Footer or Footer2
    const useFooter = [
        "/",
        "/home",
        "/subscribe",
        "/checkout",
        "/business-milestones",
        "/service-milestones",
    ].some(
        (path) =>
            location.pathname === path ||
            location.pathname.startsWith(`${path}/`)
    );


    //setToken(null);
  const FIVE_MINS = 1 * 60 * 1000;
  const GENERAL_DEBOUNCE_TIME = 500;
   // SET USER IDEAL TIME WITH DEBOUNCE
   const handleOnUserIdle = () =>{
    sessionStorage.clear();
    setToken(null);
    $.alert({
                title: "Please Log In!",
                content: "You're Logged Out.",
                });
  }
  if(token && token !=null)
  useIdleTimer({
    timeout: FIVE_MINS, // time in millisecond
    onIdle: handleOnUserIdle,
    debounce: GENERAL_DEBOUNCE_TIME, // time in millisecond
  });


    return (
        <div id="defaultLayout" className="relative z-20">
            {/*{!token ? <Nav2 /> : <Navbar />}*/}
            {/*{!isHome ? <Nav2 /> : <Topsection />}*/}
            {location.pathname === "/services" ||
            /^\/subscribe(\/|$)/.test(location.pathname) ||
            /^\/checkout(\/|$)/.test(location.pathname) ||
            /^\/business-milestones(\/|$)/.test(location.pathname) ||
            /^\/service-milestones(\/|$)/.test(location.pathname) ||
            /^\/investEquip\/[^/]+\/[^/]+\/[^/]+$/.test(location.pathname) ? (
                /^\/checkout\/[^/]+\/[^/]+\/[^/]+\/[^/]+$/.test(
                    location.pathname
                ) ? (
                    <PaymentHero />
                ) : null
            ) : location.pathname === "/" || isHome ? (
                <Topsection />
            ) : (
                <Nav2 />
            )}

            <main>
                <Outlet />
            </main>

            <Footer />

            {/* Conditionally render Footer or Footer2 */}
            {/*{useFooter ? <Footer /> : <Footer2 />}*/}
        </div>
    );
}
