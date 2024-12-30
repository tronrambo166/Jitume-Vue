import { FaMapMarkerAlt, FaSearch, FaChevronDown } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Search = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [location, setLocation] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const locationInputRef = useRef(null);
    const suggestionsRef = useRef(null);

    // Extract category from the route
    const currentCategory = pathname.split("/").pop().replaceAll("-", " ");

    const fetchSuggestions = (searchText) => {
        fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(searchText)}`
        )
            .then((response) => response.json())
            .then((data) => {
                const fetchedSuggestions = data.features.map((feature) => {
                    const { name, city, country } = feature.properties;
                    return `${name}, ${city || ""} ${country}`.trim();
                });
                setSuggestions(fetchedSuggestions.slice(0, 10));
            })
            .catch((error) =>
                console.error("Error fetching suggestions:", error)
            );
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target) &&
                locationInputRef.current &&
                !locationInputRef.current.contains(event.target)
            ) {
                setSuggestions([]);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleLocationChange = (e) => {
        const searchText = e.target.value;
        setLocation(searchText);

        if (searchText.length > 2) {
            fetchSuggestions(searchText);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setLocation(suggestion);
        setSuggestions([]);
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        if (selectedCategory) {
            const formattedCategory = selectedCategory.replaceAll(" ", "-");
            navigate(`/servicecategory/${formattedCategory}`);
        }
    };

    return (
        <div className="px-4 sm:px-0 w-full">
            <div className="bg-gray-200 border w-full rounded-lg">
                <div className="flex flex-col sm:flex-row items-center h-auto sm:h-16 p-2 sm:p-0 w-full">
                    {/* Categories Dropdown */}
                    <div className="relative rounded-xl flex items-center h-12 sm:h-full w-full sm:w-1/4 mb-2 sm:mb-0">
                        <select
                            className="appearance-none rounded-lg sm:rounded-lg lg:rounded-r-none h-full bg-white focus:outline-none text-gray-500 w-full pl-3 pr-10"
                            value={currentCategory || ""}
                            onChange={handleCategoryChange}
                        >
                            <option value="">Select Category</option>
                            <option value="Business Planning">
                                Business Planning
                            </option>
                            <option value="IT">IT</option>
                            <option value="Legal">Legal</option>
                            <option value="Project Management">
                                Project Management
                            </option>
                            <option value="Branding And Design">
                                Branding and Design
                            </option>
                            <option
                                value="Finance, Accounting & Tax"
                                className="whitespace-normal"
                            >
                                Finance, Accounting & Tax
                            </option>
                            <option value="Marketing">Marketing</option>
                            <option value="Public Relations">
                                Public Relations
                            </option>
                            <option value="Auto">Auto</option>
                        </select>
                        <FaChevronDown className="absolute right-3 text-gray-500 pointer-events-none" />
                    </div>

                    {/* Location Input with Suggestions */}
                    <div className="relative w-full sm:w-1/4 h-12 sm:h-full mb-2 sm:mb-0">
                        <FaMapMarkerAlt className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                        <input
                            ref={locationInputRef}
                            type="text"
                            placeholder="Location"
                            className="h-full focus:outline-none rounded-lg sm:rounded-lg lg:rounded-none w-full pl-8 text-lg py-2"
                            value={location}
                            onChange={handleLocationChange}
                        />
                        {suggestions.length > 0 && (
                            <ul
                                ref={suggestionsRef}
                                className="absolute z-10 bg-white rounded-lg w-full mt-1 max-h-40 overflow-y-auto shadow-md"
                            >
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

                    {/* Search Input */}
                    <div className="relative w-full sm:w-1/4 h-12 sm:h-full mb-2 sm:mb-0 flex-grow">
                        <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                        <input
                            type="text"
                            placeholder="What Are You Looking For?"
                            className="h-full focus:outline-none w-full pl-8 rounded-lg sm:rounded-lg lg:rounded-none text-lg py-2"
                        />
                    </div>

                    {/* Search Button */}
                    <button className="bg-[#FDE047] text-black rounded-lg sm:rounded-lg lg:rounded-r-lg lg:rounded-l-none h-12 sm:h-full py-2 px-9 w-full sm:w-auto text-lg">
                        Search in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Search;
