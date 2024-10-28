import React, { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 300) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            {visible && (
                <button
                    onClick={scrollToTop}
                    className={`fixed bottom-5 right-5 bg-green-600 text-white p-3 rounded-full shadow-lg 
                        transition-all duration-300 transform ${
                            visible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        } hover:bg-green-700 z-50`}
                    aria-label="Scroll to top"
                >
                    <FaChevronUp />
                </button>
            )}
        </>
    );
};

export default ScrollToTop;
