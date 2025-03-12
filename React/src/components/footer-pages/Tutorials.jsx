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
            title: "Tujitume: Empowering Startups and SMEs through Local / Diaspora Investment.",
            description: [
                "Tujitume is a pioneering web platform designed to connect startups and SMEs with investors, equipping them with the insights and business services they need to secure funding in their local markets. By providing tailored solutions that address regional challenges, Tujitume enhances the investment readiness of startups and SMEs while offering investors a secure and transparent way to discover promising businesses.",
                "At the core of Tujitume is a robust escrow system, ensuring that funding and service delivery occur in structured phases or milestones. This guarantees accountability, traceability, and trust at every stage. Additionally, integrated project management tools facilitate seamless transactions, offering both startups and investors clear performance insights that drive successful partnership.",
            ],
            videoUrl:
                "https://drive.google.com/file/d/1PyUfXjC_5zMAAFoLvpZzAWqL2u6lLo23/preview",
            listItems: [],
        },
        {
            id: "Investor User Flow on Tujitume.",
            title: "Business Flow (Monetary)",
            description: [
                "Understanding how monetary transactions work within Tujitume is essential for all users. This section explains the complete business flow, from listing equipment to payment processing and equipment return.",
            ],
            videoUrl: "https://drive.google.com/file/d/1eiMJQZkMVTWSj6N8AAK086vXkpGtZPfZ/preview", // Replace with actual video URL
            listItems: [
                "Investors visit Tujitume’s marketplace to explore vetted startups and SMEs within their preferred region.",
                "They create an account to initiate the investment process.",
                "To begin investing, they place a 25% monetary deposit or contribute equipment of equivalent value, as outlined in the investment notes.",
                "The startup or SME reviews the investment proposal and either accepts or rejects it via their dashboard.",
                "Once accepted, the investor funds the business in structured milestone-based phases until the full investment is completed.",
            ],
        },
        {
            id: "business",
            title: "Business Flow (Equipment)",
            description: [
                "Understanding how transactions and equipment movement work within Tujitume is essential for all users. This section explains the complete business flow, from listing equipment to payment processing and equipment return.",
            ],
            videoUrl: "https://drive.google.com/file/d/1IAADgamusdIb730Tios1jZ9yxJSa_a3y/preview", // Replace with actual video URL
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
                "The service flow tutorial demonstrates how users interact with the Tujitume platform from registration to complete delivering a service. This comprehensive guide shows the step-by-step process of creating a service by service owner then booking, paying the service fee, and completing milestones by customer until service is completed.",
            ],
            videoUrl: "https://drive.google.com/file/d/10XOBGd9uTYTgORbl17eZotsn0xnIc4PI/preview", // Replace with actual video URL
            listItems: [
                "Businesses visit the services section to browse a marketplace of business services available in their region.",
                "They create an account to book a service.",
                "The service is booked directly from an individual service provider’s page.",
                "The provider reviews the request and either accepts or rejects it via their dashboard.",
                "If accepted, the requester pays for the full service upfront, with payments.",
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
