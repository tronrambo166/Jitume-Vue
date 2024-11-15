import React, { useState } from "react";

const MapSection = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <>
            {/* Desktop Map Section - Only visible on lg and up */}
            <div className="hidden lg:flex h-[500px] lg:h-auto rounded-lg items-center justify-center">
                <div
                    className="map_style w-full h-full"
                    style={{
                        borderRadius: "16px",
                        overflow: "hidden",
                    }}
                >
                    <div
                        id="map"
                        style={{
                            height: "100%",
                            width: "100%",
                            borderRadius: "16px",
                        }}
                    ></div>
                </div>
            </div>

            {/* Mobile Button and Drawer for Map */}
            <div className="lg:hidden flex flex-col items-center justify-center">
                <button
                    className="bg-blue-600 text-white py-2 px-4 rounded-md w-full mb-2"
                    onClick={toggleDrawer}
                >
                    View Map Location
                </button>

                {/* Map Drawer */}
                {isDrawerOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50">
                        <div className="bg-white w-full h-[60vh] rounded-t-lg overflow-hidden relative">
                            {/* Close Button */}
                            <button
                                onClick={toggleDrawer}
                                className="absolute top-4 right-4 text-gray-600 font-bold text-lg"
                            >
                                ✕
                            </button>

                            {/* Map Content */}
                            <div
                                className="map_style w-full h-full"
                                style={{
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    id="map"
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        borderRadius: "16px",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default MapSection;
