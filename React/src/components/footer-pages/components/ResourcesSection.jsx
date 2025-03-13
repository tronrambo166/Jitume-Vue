import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

// Resource item component
const ResourceItem = ({ title, items, onResourceClick }) => {
    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-3">{title}</h3>
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <svg
                            className="w-4 h-4 mr-2 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <a
                            href="#"
                            className="text-green-600 hover:underline"
                            onClick={(e) => {
                                e.preventDefault();
                                onResourceClick(
                                    item.title || item,
                                    item.videoId
                                );
                            }}
                        >
                            {item.title || item}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const ResourcesSection = ({ onSearchTerm, videoSections = [] }) => {
    // State to hold the categorized resources
    const [categorizedResources, setCategorizedResources] = useState({
        investor: [],
        startup: [],
        serviceProvider: [],
    });

    // Keywords for categorization
    const categoryKeywords = {
        investor: [
            "investor",
            "investment",
            "funding",
            "capital",
            "due diligence",
            "portfolio",
            "angel",
            "venture capital",
            "roi",
            "return on investment",
        ],
        startup: [
            "startup",
            "sme",
            "entrepreneur",
            "business",
            "pitch",
            "growth",
            "scaling",
            "funding",
            "milestone",
            "business plan",
        ],
        serviceProvider: [
            "service",
            "provider",
            "consultant",
            "professional",
            "legal",
            "accounting",
            "marketing",
            "branding",
            "development",
            "escrow",
        ],
    };

    // Fallback resources if no videos provided
    const defaultResources = {
        investor: [
            { title: "How payments are processed and secured", videoId: null },
            { title: "Milestone Funding Guidelines", videoId: null },
            { title: "Due Diligence Checklist", videoId: null },
            { title: "Regional Investment Opportunities", videoId: null },
        ],
        startup: [
            { title: "Investment Readiness Guide", videoId: null },
            { title: "Creating Effective Pitch Materials", videoId: null },
            { title: "Understanding Milestone Agreements", videoId: null },
            { title: "Business Growth Resources", videoId: null },
        ],
        serviceProvider: [
            { title: "Service Listing Guidelines", videoId: null },
            { title: "Escrow System Overview", videoId: null },
            { title: "Milestone Delivery Framework", videoId: null },
            { title: "Professional Services Best Practices", videoId: null },
        ],
    };

    // Effect to automatically analyze and categorize video content
    useEffect(() => {
        if (!videoSections || videoSections.length === 0) {
            // Use default resources if no videos are provided
            setCategorizedResources(defaultResources);
            return;
        }

        const categorized = {
            investor: [],
            startup: [],
            serviceProvider: [],
        };

        // Process each video section
        videoSections.forEach((section) => {
            // Skip if no title or empty section
            if (!section.title) return;

            // Initialize category scores
            const scores = {
                investor: 0,
                startup: 0,
                serviceProvider: 0,
            };

            // Score based on title
            const titleLower = section.title.toLowerCase();

            // Score based on description text
            const descriptionText = section.description
                ? section.description.join(" ").toLowerCase()
                : "";

            // Score based on list items
            const listItemsText = section.listItems
                ? section.listItems.join(" ").toLowerCase()
                : "";

            // Combine all text for analysis
            const allText = `${titleLower} ${descriptionText} ${listItemsText}`;

            // Calculate scores for each category
            Object.keys(categoryKeywords).forEach((category) => {
                categoryKeywords[category].forEach((keyword) => {
                    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
                    const matches = (allText.match(regex) || []).length;
                    scores[category] += matches;
                });
            });

            // Determine the highest scoring category
            let highestCategory = "startup"; // Default category
            let highestScore = 0;

            Object.keys(scores).forEach((category) => {
                if (scores[category] > highestScore) {
                    highestScore = scores[category];
                    highestCategory = category;
                }
            });

            // Extract key points to create resource titles
            let resourceTitle = section.title;

            // If title is too generic, try to create a more specific resource title
            if (section.listItems && section.listItems.length > 0) {
                // Use the first list item to enhance the title
                resourceTitle = `${section.title}: ${section.listItems[0]}`;
            }

            // Add to the appropriate category
            categorized[highestCategory].push({
                title: resourceTitle,
                videoId: section.id,
                section: section,
            });
        });

        // If any category is empty, add placeholder content from defaultResources
        Object.keys(categorized).forEach((category) => {
            if (categorized[category].length === 0) {
                categorized[category] = defaultResources[category];
            }
        });

        setCategorizedResources(categorized);
    }, [videoSections]);

    // Handle resource click
    const handleResourceClick = (resourceTitle, videoId) => {
        // Find the corresponding video section
        const videoSection = videoSections.find(
            (section) =>
                section.id === videoId || section.title === resourceTitle
        );

        // Pass the clicked resource and video info up to the parent component
        onSearchTerm(resourceTitle, videoSection);
    };

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-semibold mb-8 text-center">
                    A Platform Rooted in African Communal Growth
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10 text-left">
                    In Africa, we thrive on communal support, naturally
                    gravitating toward helping those within our own geographical
                    and cultural backgrounds. Tujitume harnesses this inherent
                    spirit of community by making it easier for investors to
                    find and support local entrepreneurs.
                </p>
                <div className="text-lg text-gray-600 max-w-3xl mx-auto mb-10 text-left">
                    <p className="font-bold mb-2">
                        By decentralizing investment and business support,
                        Tujitume:
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-600 mt-1 flex-shrink-0" />
                            <span>
                                Simplifies regional investment, allowing
                                startups and SMEs to present their opportunities
                                directly to investors from their own
                                communities.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-600 mt-1 flex-shrink-0" />
                            <span>
                                Encourages professional cross-selling, enabling
                                businesses to access crucial services—such as
                                accounting, legal, and branding—locally rather
                                than having to seek them out in major cities.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-600 mt-1 flex-shrink-0" />
                            <span>
                                Creates self-sustaining micro-economies,
                                reducing reliance on high-interest financial
                                systems and government policies that often
                                overlook grassroots entrepreneurs.
                            </span>
                        </li>
                    </ul>
                    <p className="mt-4">
                        As Africans, we hold the power to uplift our own
                        economies. Tujitume is more than a platform—it is a
                        movement toward economic decentralization, empowering
                        startups and SMEs to grow through local / diaspora
                        investment and collective prosperity.
                    </p>
                    <p className="mt-4 font-bold">
                        Together, we can build Africa!
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-semibold mb-8 text-center">
                    Resources to Support Your Journey
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10 text-center">
                    Access guides and best practices to help you navigate
                    Tujitume effectively, whether you're an investor, startup,
                    or service provider.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                    <ResourceItem
                        title="For Investors"
                        items={categorizedResources.investor}
                        onResourceClick={handleResourceClick}
                    />
                    <ResourceItem
                        title="For Startups & SMEs"
                        items={categorizedResources.startup}
                        onResourceClick={handleResourceClick}
                    />
                    <ResourceItem
                        title="For Service Providers"
                        items={categorizedResources.serviceProvider}
                        onResourceClick={handleResourceClick}
                    />
                </div>
            </div>
        </section>
    );
};

export default ResourcesSection;
