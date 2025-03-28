import React from "react";

const ImageComponent = () => {
    return (
        <div className="hidden md:flex md:w-1/2 h-screen relative">
            <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Investment capital"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative z-10 flex flex-col items-center justify-center text-white text-center w-full p-8">
                <h3 className="text-3xl font-bold">Global Investment Platform</h3>
                <p className="mt-2 text-lg">
                    Connect with entrepreneurs and investment opportunities worldwide.
                </p>
            </div>
        </div>
    );
};

export default ImageComponent;
