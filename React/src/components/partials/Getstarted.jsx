import React from 'react';

const Getstarted = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
    };

    return (
        <div className="w-full bg-[#F4FBF7] flex justify-center py-[100px] mx-auto ">
            <div className="flex flex-col gap-[30px] items-center justify-center">
                <h2 className="text-[30px] font-semibold">
                    Get started today!
                </h2>
                <button
                    className="btn-primary w-40 py-2 px-8 rounded-xl whitespace-nowrap"
                    onClick={scrollToTop} 
                >
                    Find a business
                </button>
            </div>
        </div>
    );
};

export default Getstarted;
