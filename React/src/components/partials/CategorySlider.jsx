import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const Listings = () => {
    const [turnoverRange, setTurnoverRange] = useState([0, 1000000]);
    const [amountRange, setAmountRange] = useState([0, 1000000]);

    const handleTurnoverChange = (value) => {
        setTurnoverRange(value);
    };

    const handleAmountChange = (value) => {
        setAmountRange(value);
    };

    // Marks for the sliders (vertical lines without dots)
    const sliderMarks = {
        0: "",
        100000: "|",
        200000: "|",
        300000: "|",
        400000: "|",
        500000: "|",
        600000: "|",
        700000: "|",
        800000: "|",
        900000: "|",
        1000000: "",
    };

    return (
        <>
            {/* Amount Range */}
            <div className="border border-gray-200 rounded-lg p-4 flex-grow h-auto md:h-[143px]">
                <h3 className="text-lg font-semibold mb-2 text-[#1E293B]">
                    Amount Range
                </h3>
                <Slider
                    range
                    min={0}
                    max={1000000}
                    step={10000}
                    value={amountRange}
                    onChange={handleAmountChange}
                    trackStyle={{ backgroundColor: "green", height: "10px" }}
                    handleStyle={{
                        borderColor: "white",
                        height: "18px",
                        width: "18px",
                        marginTop: "-4px",
                        backgroundColor: "green",
                        borderRadius: "50%",
                        border: "2px solid white",
                    }}
                    marks={sliderMarks}
                    activeDotStyle={{ display: "none" }}
                    dotStyle={{ display: "none" }}
                />
                <div className="flex justify-between mt-8 text-[#1E293B] text-sm">
                    <span>${amountRange[0].toLocaleString()}</span>
                    <span>${amountRange[1].toLocaleString()}</span>
                </div>
            </div>
        </>
    );
};

export default Listings;
