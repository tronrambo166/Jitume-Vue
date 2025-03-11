import React from "react";

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
                                onResourceClick(item);
                            }}
                        >
                            {item}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const ResourcesSection = ({ onSearchTerm }) => {
    const investorResources = [
        "Investment Best Practices",
        "Milestone Funding Guidelines",
        "Due Diligence Checklist",
        "Regional Investment Opportunities",
    ];

    const startupResources = [
        "Investment Readiness Guide",
        "Creating Effective Pitch Materials",
        "Understanding Milestone Agreements",
        "Business Growth Resources",
    ];

    const serviceProviderResources = [
        "Service Listing Guidelines",
        "Escrow System Overview",
        "Milestone Delivery Framework",
        "Professional Services Best Practices",
    ];

    const handleResourceClick = (resourceText) => {
        // Pass the clicked resource text up to the parent component
        onSearchTerm(resourceText);
    };

    return (
        <section className="py-12 bg-white">

                    <div className="container mx-auto px-4">
                <h2 className="text-3xl font-semibold mb-8 text-center">
                    A Platform Rooted in African Communal Growth

                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10 text-left">
                    In Africa, we thrive on communal support, naturally gravitating toward helping those within our own geographical and cultural backgrounds. Tujitume harnesses this inherent spirit of community by making it easier for investors to find and support local entrepreneurs. <br></br><br></br>
<b className="text-left">By decentralizing investment and business support, Tujitume:</b>
<br></br>✅ Simplifies regional investment, allowing startups and SMEs to present their opportunities directly to investors from their own communities.
<br></br>✅ Encourages professional cross-selling, enabling businesses to access crucial services—such as accounting, legal, and branding—locally rather than having to seek them out in major cities.
<br></br>✅ Creates self-sustaining micro-economies, reducing reliance on high-interest financial systems and government policies that often overlook grassroots entrepreneurs.
<br></br><br></br>As Africans, we hold the power to uplift our own economies. Tujitume is more than a platform—it is a movement toward economic decentralization, empowering startups and SMEs to grow through local / diaspora investment and collective prosperity.
<br></br><br></br><b>Together, we can build Africa!</b>
                </p>
                
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
                        items={investorResources}
                        onResourceClick={handleResourceClick}
                    />
                    <ResourceItem
                        title="For Startups & SMEs"
                        items={startupResources}
                        onResourceClick={handleResourceClick}
                    />
                    <ResourceItem
                        title="For Service Providers"
                        items={serviceProviderResources}
                        onResourceClick={handleResourceClick}
                    />
                </div>
            </div>
        </section>
    );
};

export default ResourcesSection;
