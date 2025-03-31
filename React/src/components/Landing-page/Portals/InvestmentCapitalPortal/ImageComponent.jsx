import React, { useState, useEffect } from "react";
import PortalImg from "../../../../images/wwe.jpg";

const messages = [
    {
        title: "Your Gateway to Global Investments",
        subtitle: "Discover vetted opportunities across continents",
    },
    {
        title: "Connect With Trusted Entrepreneurs",
        subtitle: "Network with innovators and business leaders worldwide",
    },
    {
        title: "Smart Investing Made Simple",
        subtitle: "Access curated deals with transparent metrics",
    },
    {
        title: "Borderless Investment Platform",
        subtitle: "Grow your portfolio beyond geographical limits",
    },
];

const ImageSection = () => {
    const [currentMessage, setCurrentMessage] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [fadeDirection, setFadeDirection] = useState("out");

    useEffect(() => {
        const interval = setInterval(() => {
            setFadeDirection("out");
            setIsAnimating(true);

            setTimeout(() => {
                setCurrentMessage((prev) => (prev + 1) % messages.length);
                setFadeDirection("in");

                setTimeout(() => {
                    setIsAnimating(false);
                }, 500);
            }, 500);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const getAnimationClasses = () => {
        if (!isAnimating) return "opacity-100 transform translate-y-0";
        if (fadeDirection === "out")
            return "opacity-0 transform -translate-y-4 transition-all duration-500 ease-in-out";
        return "opacity-100 transform translate-y-0 transition-all duration-500 ease-in-out";
    };

    return (
        <div className="hidden md:flex md:w-1/2 h-screen relative overflow-hidden">
            <img
                src={PortalImg}
                alt="Global investment network"
                className="absolute inset-0 w-full h-full object-cover transform scale-105 animate-slowZoom"
                style={{
                    animation: "slowZoom 20s infinite alternate ease-in-out",
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
            <div className="relative z-10 flex flex-col items-center justify-center text-white text-center w-full p-8">
                <div className={getAnimationClasses()}>
                    <h3 className="text-3xl font-bold mb-3 text-white drop-shadow-lg">
                        {messages[currentMessage].title}
                    </h3>
                    <p className="mt-2 text-lg text-white/90 drop-shadow-md">
                        {messages[currentMessage].subtitle}
                    </p>
                </div>
                
            </div>
            <div className="absolute top-1/4 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
    );
};



export default ImageSection;
