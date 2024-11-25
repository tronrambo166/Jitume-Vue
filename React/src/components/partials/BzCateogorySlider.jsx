import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const BzCateogorySlider = ({ onFilterChange }) => {
    const [turnoverRange, setTurnoverRange] = useState([0, 1000000]);
    const [amountRange, setAmountRange] = useState([0, 1000000]);

    const handleTurnoverChange = (value) => {
        setTurnoverRange(value);
        onFilterChange({ turnoverRange: value, amountRange }); // Update filter based on slider changes
    };

    const handleAmountChange = (value) => {
        setAmountRange(value);
        onFilterChange({ turnoverRange, amountRange: value }); // Update filter based on slider changes
    };

    // Marks for the sliders (adjust for better user understanding)
    const sliderMarks = {
        0: "$0",
        100000: "$100K",
        200000: "$200K",
        300000: "$300K",
        400000: "$400K",
        500000: "$500K",
        600000: "$600K",
        700000: "$700K",
        800000: "$800K",
        900000: "$900K",
        1000000: "$1M",
    };

    return (
        <>
            {/* Wrapper to place sliders side by side */}
            <div className="flex gap-6 justify-between">
                {/* Amount Range */}
                <div className="border border-gray-200 rounded-lg p-4 flex-1">
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
                        trackStyle={{
                            backgroundColor: "green",
                            height: "10px",
                        }}
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

                {/* Turnover Range */}
                <div className="border border-gray-200 rounded-lg p-4 flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-[#1E293B]">
                        Turnover Range
                    </h3>
                    <Slider
                        range
                        min={0}
                        max={1000000}
                        step={10000}
                        value={turnoverRange}
                        onChange={handleTurnoverChange}
                        trackStyle={{
                            backgroundColor: "green",
                            height: "10px",
                        }}
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
                        <span>${turnoverRange[0].toLocaleString()}</span>
                        <span>${turnoverRange[1].toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BzCateogorySlider;
