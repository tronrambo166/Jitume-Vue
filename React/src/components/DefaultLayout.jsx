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
// i know i have writen this code it say ten seconds but its 5 minutes  ten second is 10000 
    const TEN_SECONDS = 300000; // Idle timeout (10 seconds)
    //const Five = 300000; // Idle timeout (5 Mins)
    const DEBOUNCE_TIME = 1000; //it will wait 1 second before checking if the user is idle

    // Handle user idle action
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

    // Initialize idle timer if user is logged in
    useIdleTimer({
        timeout: TEN_SECONDS, // Set to 10 seconds for accurate idle detection
        onIdle: handleOnUserIdle,
        debounce: DEBOUNCE_TIME, // 1 second debounce time to prevent premature triggering
        enabled: !!token && token !== "false", // Only enable if the user is logged in
    });

    //     //setToken(null);
    //   const FIVE_MINS = 1 * 3 * 1000;
    //   const GENERAL_DEBOUNCE_TIME = 500;
    //    // SET USER IDEAL TIME WITH DEBOUNCE
    //    const handleOnUserIdle = (e) =>{
    //     e.preventDefault();
    //     localStorage.clear();
    //     setToken(null);
    //     $.alert({
    //                 title: "Please Log In!",
    //                 content: "You're Logged Out.",
    //                 });
    //   }

    if (token && token != "false") {
        //   useIdleTimer({
        //   timeout: FIVE_MINS, // time in millisecond
        //   onIdle: handleOnUserIdle(e),
        //   debounce: GENERAL_DEBOUNCE_TIME, // time in millisecond
        // });
    }

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
