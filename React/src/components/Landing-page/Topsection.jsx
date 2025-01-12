import Hero from "./Hero";
import InfiniteScrollCategories from "../Landing-page/InfiniteScrollCategories(2)";
import Navbar from "./Navbar";
import NavbarGuest from "./Navbar";
import Search from "./Search";
import TopCards from "./Topcards";
import overlayImage from "../../images/overlay.webp"; // Adjust path if needed
import { useStateContext } from "../../contexts/contextProvider";
import axiosClient from "../../axiosClient";

const Topsection = () => {
    const { token } = useStateContext();
    const isDashboardRoute = location.pathname.startsWith("/dashboard");

    return (
        <div className="relative w-full bg-[#00290F] pb-10 overflow-x-hidden">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center z-10"
                style={{
                    backgroundImage: `url(${overlayImage})`,
                }}
            ></div>

            {/* Content */}
            <div className="relative z-20">
                {token ? <Navbar /> : <NavbarGuest />}
                <Hero />
                <Search />
                <InfiniteScrollCategories />
                <TopCards />
            </div>
        </div>
    );
};

export default Topsection;
