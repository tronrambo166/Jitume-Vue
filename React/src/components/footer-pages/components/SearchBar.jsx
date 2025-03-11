import React, {
    useState,
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from "react";

const SearchBar = forwardRef(({ videos, onSearchResults }, ref) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [manuallyClosedDropdown, setManuallyClosedDropdown] = useState(false);
    const searchInputRef = useRef(null);
    const suggestionsRef = useRef(null);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        // Method to set search term and trigger search
        setSearchAndTrigger: (term) => {
            setSearchTerm(term);

            // Perform search with the new term
            performSearch(term);

            // Focus on the search input
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        },
        // Method to scroll into view
        scrollIntoView: (options) => {
            if (searchInputRef.current) {
                searchInputRef.current.scrollIntoView(options);
            }
        },
    }));

    // Generate suggestions from all video data
    const generateSuggestions = (searchValue) => {
        if (!searchValue.trim()) {
            return [];
        }

        const allSuggestions = new Set();

        // Add titles
        videos.forEach((video) => {
            if (video.title.toLowerCase().includes(searchValue.toLowerCase())) {
                allSuggestions.add(video.title);
            }
        });

        // Add keywords from descriptions
        videos.forEach((video) => {
            video.description.forEach((desc) => {
                const words = desc.split(" ");
                words.forEach((word) => {
                    if (
                        word.length > 3 &&
                        word.toLowerCase().includes(searchValue.toLowerCase())
                    ) {
                        allSuggestions.add(word);
                    }
                });
            });
        });

        // Add list items
        videos.forEach((video) => {
            video.listItems.forEach((item) => {
                if (item.toLowerCase().includes(searchValue.toLowerCase())) {
                    allSuggestions.add(item);
                }
            });
        });

        return Array.from(allSuggestions).slice(0, 6); // Limit to 6 suggestions
    };

    useEffect(() => {
        // Generate suggestions whenever search term changes
        const newSuggestions = generateSuggestions(searchTerm);
        setSuggestions(newSuggestions);

        // Only show suggestions if not manually closed
        if (!manuallyClosedDropdown) {
            setShowSuggestions(newSuggestions.length > 0);
        }
    }, [searchTerm, videos, manuallyClosedDropdown]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target) &&
                !searchInputRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Function to perform search
    const performSearch = (term) => {
        if (!term.trim()) {
            // If search is empty, show all videos
            onSearchResults(videos);
            return;
        }

        // Search in title, description and listItems
        const results = videos.filter((video) => {
            const titleMatch = video.title
                .toLowerCase()
                .includes(term.toLowerCase());
            const descriptionMatch = video.description.some((desc) =>
                desc.toLowerCase().includes(term.toLowerCase())
            );
            const listItemsMatch = video.listItems.some((item) =>
                item.toLowerCase().includes(term.toLowerCase())
            );

            return titleMatch || descriptionMatch || listItemsMatch;
        });

        onSearchResults(results);
        setShowSuggestions(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        performSearch(searchTerm);
    };

    // Handle real-time search as user types
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (!value.trim()) {
            onSearchResults(videos); // Reset to all videos when search is cleared
            setShowSuggestions(false);
        } else {
            setManuallyClosedDropdown(false); // Reset manual close flag when typing
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        setManuallyClosedDropdown(true);
        setSearchTerm(suggestion);
        setShowSuggestions(false);
        performSearch(suggestion);

        // Reset the manually closed flag after a brief delay
        setTimeout(() => {
            setManuallyClosedDropdown(false);
        }, 200);
    };

    // Handle input focus
    const handleInputFocus = () => {
        if (
            searchTerm.trim() &&
            suggestions.length > 0 &&
            !manuallyClosedDropdown
        ) {
            setShowSuggestions(true);
        }
    };

    return (
        <div className="mb-8 relative">
            <form
                onSubmit={handleSearch}
                className="flex w-full max-w-2xl mx-auto"
            >
                <div className="relative flex-grow">
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search for tutorials, topics, or keywords..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        className="w-full py-2 px-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
                    />

                    {showSuggestions && suggestions.length > 0 && (
                        <div
                            ref={suggestionsRef}
                            className="absolute z-10 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg mt-1"
                        >
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() =>
                                        handleSuggestionClick(suggestion)
                                    }
                                >
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-green text-white py-2 px-6 rounded-r-lg font-medium hover:bg-opacity-90"
                >
                    Search
                </button>
            </form>
        </div>
    );
});

export default SearchBar;
