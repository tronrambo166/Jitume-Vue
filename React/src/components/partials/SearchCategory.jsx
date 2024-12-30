import { FaMapMarkerAlt, FaSearch, FaChevronDown } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Search = ({ value, setLocationQuery, setNameQuery }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [location, setLocation] = useState(value.locationQuery || ""); // Initial value for location
    const [searchItem, setSearchItem] = useState(value.nameQuery || ""); // Initial value for search item
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

                    // Concatenate name, city, and country into a string for rendering
                    const fullLocation = `${name}, ${city || ""} ${
                        country || ""
                    }`.trim();

                    return fullLocation; // Return just the string, not the object
                });
                setSuggestions(fetchedSuggestions.slice(0, 10)); // Update the state with the string array
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
        // Strip out anything after the first comma
        const cleanLocation = suggestion.split(",")[0]; // Get the first part (city or name)
        setLocation(cleanLocation); // Set location to the clean location
        setSuggestions([]);
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        if (selectedCategory) {
            // Reset location and search item
            setLocation(""); // Clear location input
            setSearchItem(""); // Clear search item input

            // Update parent component's query state (if needed)
            setLocationQuery("");
            setNameQuery("");

            // Navigate to the selected category
            const formattedCategory = selectedCategory.replaceAll(" ", "-");
            navigate(`/category/${formattedCategory}`);
        }
    };

    const handleSearchSubmit = () => {
        // Pass the search term and location query to parent component
        setLocationQuery(location);
        setNameQuery(searchItem);
        console.log("Location chosen is:", location);
        console.log("Search item is:", searchItem);
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
                            <option value="All Categories">
                                All Categories
                            </option>
                            <option value="Agriculture">Agriculture</option>
                            <option value="Arts-Culture">Arts-Culture</option>
                            <option value="Auto">Auto</option>
                            <option value="Domestic">Domestic</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Finance-Accounting">
                                Finance-Accounting
                            </option>
                            <option value="Food">Food</option>
                            <option value="Legal">Legal</option>
                            <option value="Media-Internet">
                                Media-Internet
                            </option>
                            <option value="Other">Other</option>
                            <option value="Pets">Pets</option>
                            <option value="Real-State">Real-State</option>
                            <option value="Retail">Retail</option>
                            <option value="Security">Security</option>
                            <option value="Sports-Gaming">Sports-Gaming</option>
                            <option value="Technology-Communications">
                                Technology-Communications
                            </option>
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
                                        {suggestion}{" "}
                                        {/* Ensure that suggestion is a string */}
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
                            value={searchItem} // Bind searchItem to the input
                            onChange={(e) => setSearchItem(e.target.value)} // Update searchItem state
                        />
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={handleSearchSubmit}
                        className="bg-[#FDE047] text-black rounded-lg sm:rounded-lg lg:rounded-r-lg lg:rounded-l-none h-12 sm:h-full py-2 px-9 w-full sm:w-auto text-lg"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Search;
