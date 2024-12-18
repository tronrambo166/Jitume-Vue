import React, { useState } from "react";
import axios from "axios";

const LocationInputModal = ({ isOpen, onClose, onSelectLocation }) => {
    const [searchText, setSearchText] = useState("");
    const [locations, setLocations] = useState([]);

    const getPlaces = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(
                `https://photon.komoot.io/api/?q=${encodeURIComponent(
                    searchText
                )}`
            );
            setLocations(response.data.features);
        } catch (error) {
            console.error("Error fetching location data:", error);
        }
    };

    const handleSelectLocation = (name, lat, lng) => {
        onSelectLocation(name, lat, lng);
        onClose(); // Close the modal after selecting
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg relative">
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                            aria-label="Close"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <h3 className="text-lg font-semibold mb-4">
                            Select Location
                        </h3>
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
                            placeholder="Enter a location..."
                            onKeyUp={getPlaces}
                        />
                        <ul className="max-h-60 overflow-y-auto">
                            {locations.map((location, index) => (
                                <li
                                    key={index}
                                    className="cursor-pointer p-2 hover:bg-gray-200"
                                    onClick={() =>
                                        handleSelectLocation(
                                            location.properties.name,
                                            location.geometry.coordinates[1],
                                            location.geometry.coordinates[0]
                                        )
                                    }
                                >
                                    {location.properties.name},{" "}
                                    {location.properties.city || ""}{" "}
                                    {location.properties.country}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default LocationInputModal;
