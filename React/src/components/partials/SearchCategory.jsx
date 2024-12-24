import { FaMapMarkerAlt, FaSearch } from "react-icons/fa"; // Import only necessary icons
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

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
                "Seattle",
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
        <div className="px-4 sm:px-0 w-full">
            <div className="bg-gray-200 border w-full  rounded-xl">
                {/* Search Section */}
                <div className="flex flex-col sm:flex-row items-center h-auto sm:h-16 p-2 sm:p-0 w-full">
                    {/* Categories Dropdown */}
                    <div className="relative rounded-l-xl flex items-center h-12 sm:h-full w-full sm:w-1/4 mb-2 sm:mb-0 bg-white">
                        <select className="bg-transparent rounded-l-xl h-full focus:outline-none text-gray-500 w-full pl-3 pr-8 text-lg appearance-none">
                            <option value="">All Categories</option>
                            <option value="category1">Category 1</option>
                            <option value="category2">Category 2</option>
                            {/* Add more options as needed */}
                        </select>
                        <FaChevronDown className="absolute right-3 text-gray-500 pointer-events-none" />
                    </div>

                    {/* Thinner Separator Line (hidden on small screens) */}
                    <div className="hidden sm:block h-10 mx-0"></div>

                    {/* Location Input with Suggestions */}
                    <div className="relative w-full sm:w-1/4 h-12 sm:h-full mb-2 sm:rounded-lg lg:rounded-none sm:mb-0">
                        <FaMapMarkerAlt className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                        <input
                            type="text"
                            placeholder="Location"
                            className=" h-full focus:outline-none  rounded-lg sm:rounded-lg lg:rounded-none w-full pl-8 text-lg py-2"
                            value={location}
                            onChange={handleLocationChange}
                        />
                        {/* Suggestions Dropdown */}
                        {suggestions.length > 0 && (
                            <ul className="absolute z-10 bg-white rounded-lg w-full mt-1 max-h-40 overflow-y-auto">
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onClick={() =>
                                            handleSuggestionClick(suggestion)
                                        }
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                    >
                                        <FaMapMarkerAlt className="mr-2 text-gray-500" />
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Thinner Separator Line (hidden on small screens) */}
                    <div className="hidden sm:block h-10  mx-0"></div>

                    {/* What are you looking for Input */}
                    <div className="relative w-full sm:w-1/4 h-12 sm:h-full mb-2 sm:mb-0 flex-grow">
                        <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                        <input
                            type="text"
                            placeholder="What Are You Looking For?"
                            className=" h-full focus:outline-none w-full pl-8 rounded-lg sm:rounded-lg lg:rounded-none text-lg py-2"
                        />
                    </div>

                    {/* Search Button */}
                    <button className="bg-[#FDE047] text-black rounded-lg sm:rounded-lg lg:rounded-r-lg lg:rounded-l-none h-12 sm:h-fullh-12 sm:h-full py-2 px-9 w-full sm:w-auto text-lg">
                        Search in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Search;
