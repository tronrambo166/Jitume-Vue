import { FaMapMarkerAlt, FaSearch } from "react-icons/fa"; // Import only necessary icons
import { useState } from "react";

const Search = () => {
    const [location, setLocation] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    // Mock function to simulate fetching suggestions
    const handleLocationChange = (e) => {
        const value = e.target.value;
        setLocation(value);

        // You can replace this with a real API call for location suggestions
        if (value.length > 2) {
            setSuggestions([
                "New York",
                "Los Angeles",
                "San Francisco",
                "Nairobi",
            ]); // Example data
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setLocation(suggestion);
        setSuggestions([]);
    };

    return (
        <div className="px-2 sm:px-0 w-full">
            {/* Added negative margin to move the container to the left */}
            <div className="w-full -ml-1">
                {" "}
                {/* Adjust -ml-2 for more/less spacing */}
                {/* Search Section */}
                <div className="flex flex-col sm:flex-row items-center p-1 sm:p-1.5 w-full">
                    {/* Categories Dropdown */}
                    <div className="relative flex items-center h-10 w-full sm:w-1/4 mb-1 sm:mb-0 bg-white rounded-l-lg">
                        <select className="border-none bg-transparent focus:outline-none text-gray-500 text-xs sm:text-sm w-full pl-2 pr-2">
                            <option value="">All Categories</option>
                            <option value="category1">Category 1</option>
                            <option value="category2">Category 2</option>
                            {/* Add more options as needed */}
                        </select>
                    </div>

                    {/* Location Input with Suggestions */}
                    <div className="relative w-full sm:w-1/4 h-10 mb-1 sm:mb-0">
                        <FaMapMarkerAlt className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                        <input
                            type="text"
                            placeholder="Location"
                            className="border-none h-full focus:outline-none w-full pl-8 text-xs sm:text-sm"
                            value={location}
                            onChange={handleLocationChange}
                        />
                        {/* Suggestions Dropdown */}
                        {suggestions.length > 0 && (
                            <ul className="absolute z-10 bg-white border border-gray-200 rounded-lg w-full mt-1 max-h-40 overflow-y-auto">
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onClick={() =>
                                            handleSuggestionClick(suggestion)
                                        }
                                        className="px-3 py-1 cursor-pointer hover:bg-gray-100 flex items-center"
                                    >
                                        <FaMapMarkerAlt className="mr-1 text-gray-500" />
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* What are you looking for Input */}
                    <div className="relative w-full sm:w-1/4 h-10 mb-1 sm:mb-0 flex-grow">
                        <FaSearch className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                        <input
                            type="text"
                            placeholder="What are you looking for?"
                            className="border-none h-full focus:outline-none w-full pl-8 text-xs sm:text-sm"
                        />
                    </div>

                    {/* Search Button */}
                    <button className="bg-[#FDE047] text-black rounded-r-lg h-10 py-1 px-3 sm:px-4 w-full sm:w-auto text-xs sm:text-sm">
                        Search in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Search;
