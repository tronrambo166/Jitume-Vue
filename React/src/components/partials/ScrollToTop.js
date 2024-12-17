// src/components/ScrollToTop.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTop } from "../utils/scrollToTop";

const ScrollToTop = () => {
    const location = useLocation();

    useEffect(() => {
        scrollToTop();
    }, [location]);

    return null; // This component doesn't need to render anything
};

export default ScrollToTop;
