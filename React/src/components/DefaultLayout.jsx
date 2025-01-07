import { Outlet, useLocation } from "react-router-dom";
import { useStateContext } from "../contexts/contextProvider";
import { Suspense, lazy } from "react";
// just meee again

// Lazy load components
const Topsection = lazy(() => import("./Landing-page/Topsection"));
const Footer = lazy(() => import("./Landing-page/Footer"));
const Nav2 = lazy(() => import("./Landing-page/global/Nav2"));


const PaymentHero = lazy(() => import("./Heros/PaymentHero"));
import Animation from "../assets/Animation.json"
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

    if (token && token !== "false") {
        // Handle user idle logic (if needed)
    }

    return (
        <div id="defaultLayout" className="relative z-20">
            {/* Conditionally render Topsection or Nav2 */}
            <Suspense fallback={<div>Loading...</div>}>
                {location.pathname === "/services" ||
                /^\/subscribe(\/|$)/.test(location.pathname) ||
                /^\/checkout(\/|$)/.test(location.pathname) ||
                /^\/checkoutS(\/|$)/.test(location.pathname) ||
                /^\/business-milestones(\/|$)/.test(location.pathname) ||
                /^\/service-milestones(\/|$)/.test(location.pathname) ||
                /^\/investEquip\/[^/]+\/[^/]+\/[^/]+$/.test(location.pathname) ? (
                    /^\/checkout\/[^/]+\/[^/]+\/[^/]+\/[^/]+$/.test(
                        location.pathname
                    )
                ) : location.pathname === "/" || isHome ? (
                    <Topsection />
                ) : (
                    <Nav2 />
                )}
            </Suspense>

            <main>
                <Outlet />
            </main>

            <Suspense fallback={<div>Loading Footer...</div>}>
                <Footer />
            </Suspense>

            {/* Conditionally render Footer or Footer2
            {/{useFooter ? <Footer /> : <Footer2 />}/} */}
        </div>
    );
}