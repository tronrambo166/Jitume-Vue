// components/SupportSection.js
import React from "react";

const SupportSection = () => {
    return (
        <section className="mt-16 bg-green-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">
                Need Additional Help?
            </h2>
            <p className="mb-4">
                Our support team is available to assist you with any questions
                about using Tujitume.
            </p>
             <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                support@tujitume.com
            </button>
        </section>
    );
};

export default SupportSection;
