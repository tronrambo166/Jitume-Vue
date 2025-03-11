import React, { useState } from "react";

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-lg">
            <button
                className="flex justify-between items-center w-full px-4 py-3 text-left font-medium"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{question}</span>
                <svg
                    className={`w-5 h-5 transform ${
                        isOpen ? "rotate-180" : ""
                    } transition-transform`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
            <div className={`px-4 pb-4 ${isOpen ? "block" : "hidden"}`}>
                <p>{answer}</p>
            </div>
        </div>
    );
};

const FAQSection = () => {
    const faqItems = [
        {
            question: "How does Tujitume's escrow system work?",
            answer: "Tujitume's robust escrow system ensures that funding and service delivery occur in structured phases or milestones. When an investor commits funds, the money is held securely in escrow and released only when predefined milestones are achieved. This guarantees accountability, traceability, and trust throughout the investment process.",
        },
        {
            question: "What is the investment process for investors?",
            answer: "Investors can browse our marketplace of vetted startups and SMEs within their preferred region. After creating an account, they initiate the investment process by placing a 25% monetary deposit or contributing equipment of equivalent value. Once the startup accepts the proposal, funding continues in milestone-based phases until the full investment is completed.",
        },
        {
            question: "How does Tujitume help businesses access services?",
            answer: "Businesses can visit our services section to browse a marketplace of business services available in their region. After creating an account, they can book services directly from individual service providers' pages. Payment is made upfront but released to service providers in milestone-based phases, ensuring quality delivery and protecting both parties.",
        },
        {
            question: "How does Tujitume verify startups and SMEs?",
            answer: "Tujitume implements a thorough vetting process for all startups and SMEs on our platform. We verify business registration, assess business models, review financial documentation, and check the credibility of founders. This rigorous process ensures investors have access to legitimate investment opportunities with real potential for growth.",
        },
        {
            question: "How does Tujitume support local economic development?",
            answer: "Tujitume decentralizes investment and business support by simplifying regional investment, encouraging professional cross-selling of services, and creating self-sustaining micro-economies. This reduces reliance on high-interest financial systems and government policies that often overlook grassroots entrepreneurs, allowing communities to uplift their own local economies.",
        },
    ];

    return (
        <section className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">
                Frequently Asked Questions
            </h2>
            <div className="space-y-4">
                {faqItems.map((item, index) => (
                    <FAQItem
                        key={index}
                        question={item.question}
                        answer={item.answer}
                    />
                ))}
            </div>
        </section>
    );
};

export default FAQSection;
