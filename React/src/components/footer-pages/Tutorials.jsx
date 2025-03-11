import React, { useState, useRef } from "react";
import SearchBar from "./components/SearchBar";
import VideoSection from "./components/VideoSection";
import ResourcesSection from "./components/ResourcesSection";
import FAQSection from "./components/FAQSection";
import SupportSection from "./components/SupportSection";

const Tutorials = () => {
    // Video data
    const videoSections = [
        {
            id: "overview",
            title: "Tujitume Overview",
            description: [
                "Welcome to Tujitume! This overview introduces you to our platform designed to connect equipment owners with those who need to rent equipment. Learn about our mission, the problems we solve, and how our platform benefits both equipment owners and renters through an efficient, secure, and user-friendly marketplace.",
                "This video walks you through the key features of Tujitume and explains how our platform revolutionizes equipment rental in the region.",
                "With Tujitume, users can browse available equipment, compare rental rates, and make secure transactions all in one place. Our platform ensures transparency and trust by verifying equipment listings and enabling user reviews.",
            ],
            videoUrl:
                "https://drive.google.com/file/d/1PyUfXjC_5zMAAFoLvpZzAWqL2u6lLo23/preview",
            listItems: [],
        },
        {
            id: "business",
            title: "Business Flow (Monetary and Equipment)",
            description: [
                "Understanding how transactions and equipment movement work within Tujitume is essential for all users. This section explains the complete business flow, from listing equipment to payment processing and equipment return.",
            ],
            videoUrl: "", // Replace with actual video URL
            listItems: [
                "How payments are processed and secured",
                "Equipment verification and quality control",
                "The logistics of equipment delivery and return",
                "Our commission structure and pricing model",
                "Dispute resolution and our protection guarantees",
            ],
        },
        {
            id: "service",
            title: "Service Flow",
            description: [
                "The service flow tutorial demonstrates how users interact with the Tujitume platform from registration to completing transactions. This comprehensive guide shows the step-by-step process for both equipment owners and renters.",
            ],
            videoUrl: "", // Replace with actual video URL
            listItems: [
                "Account creation and verification",
                "Equipment listing process (for owners)",
                "Searching and requesting equipment (for renters)",
                "Communication between parties",
                "Contract creation and approval",
                "Completing transactions and leaving reviews",
            ],
        },
    ];

    // State to track filtered videos
    const [filteredVideos, setFilteredVideos] = useState(videoSections);
    const [isSearching, setIsSearching] = useState(false);

    // Ref for the search bar component
    const searchBarRef = useRef(null);

    // Handle search results
    const handleSearchResults = (results) => {
        setFilteredVideos(results);
        setIsSearching(results.length !== videoSections.length);
    };

    const resetSearch = () => {
        setFilteredVideos(videoSections);
        setIsSearching(false);
    };

    // Handle resource item click
    const handleResourceClick = (resourceText) => {
        // Scroll to search bar
        if (searchBarRef.current) {
            searchBarRef.current.scrollIntoView({ behavior: "smooth" });

            // Set search term and trigger search
            searchBarRef.current.setSearchAndTrigger(resourceText);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-6 text-green">
                Tujitume Tutorials
            </h1>

            <p className="text-center text-gray-600 mb-8">
                Learn how to use Tujitume with our collection of tutorial
                videos. Search for specific topics or browse all tutorials
                below.
            </p>

            {/* Search Bar */}
            <div id="search-section" ref={searchBarRef}>
                <SearchBar
                    videos={videoSections}
                    onSearchResults={handleSearchResults}
                    ref={searchBarRef}
                />
            </div>

            {/* No Results Message */}
            {filteredVideos.length === 0 && (
                <div className="text-center py-8 mb-8 bg-gray-50 rounded-lg ">
                    <p className="text-xl text-gray-600">
                        No tutorials matching your search were found.
                    </p>
                    <button
                        onClick={resetSearch}
                        className="mt-4 py-2 px-4 bg-green text-white font-medium rounded-lg hover:bg-opacity-90"
                    >
                        View all tutorials
                    </button>
                </div>
            )}

            {/* Search Results Count when results are found */}
            {isSearching && filteredVideos.length > 0 && (
                <div className="mb-6 flex justify-between items-center">
                    <p className="text-gray-600">
                        Found{" "}
                        <span className="font-semibold text-green">
                            {filteredVideos.length}
                        </span>{" "}
                        tutorial{filteredVideos.length !== 1 ? "s" : ""}
                    </p>
                    <button
                        onClick={resetSearch}
                        className="text-green hover:underline"
                    >
                        Reset search
                    </button>
                </div>
            )}

            {/* Video Sections */}
            {filteredVideos.map((section, index) => (
                <VideoSection
                    key={section.id}
                    section={section}
                    isLastSection={index === filteredVideos.length - 1}
                    isAlternate={index % 2 !== 0}
                />
            ))}

            {/* Additional Sections - Only shown when not searching */}
            {!isSearching && (
                <>
                    {/* Additional Resources */}
                    <ResourcesSection onSearchTerm={handleResourceClick} />

                    {/* FAQ Section */}
                    <FAQSection />

                    {/* Contact Support */}
                    <SupportSection />
                </>
            )}
        </div>
    );
};

export default Tutorials;
