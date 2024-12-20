import React, { useState, useEffect } from "react";

const DisputeResolutionPolicy = () => {
    return (
        <div
            style={{
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.8',
                fontSize: '16px',
                color: '#333',
                maxWidth: '75%',
                margin: '40px auto',
                padding: '30px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f9f9f9',
            }}
        >
            <h1 style={{ textAlign: 'center', color: 'rgb(0 179 138)', marginBottom: '20px', fontSize: '32px' }}>
                Dispute & Resolution Policy
            </h1>
            <p style={{ marginBottom: '20px' }}>
                At Jitume, we prioritize transparency, fairness, and trust to ensure smooth collaborations between businesses and investors. However, we understand that disputes may occasionally arise. This page outlines our dispute resolution process, refund policy, and the steps to ensure equitable outcomes for all parties involved.
            </p>

            <h2 style={{ marginTop: '30px', fontSize: '20px', color: '#444' }}>1. Filing a Dispute</h2>
            <p>If you encounter an issue requiring resolution, follow these steps:</p>
            <ul style={{ margin: '10px 0 20px', paddingLeft: '20px' }}>
                <li>
                    <strong>Initiate a Dispute:</strong> Log in to your Jitume account, navigate to the project milestone in question, and click on the "Raise Dispute" button. Provide detailed information about the issue, including supporting documents and evidence.
                </li>
                <li>
                    <strong>Escrow Freeze:</strong> Once a dispute is raised, any funds held in escrow for the disputed project phase will be frozen until the matter is resolved.
                </li>
                <li>
                    <strong>Notification:</strong> Both parties will be notified of the dispute and asked to submit their side of the story within 5 business days.
                </li>
            </ul>

            <h2 style={{ marginTop: '30px', fontSize: '20px', color: '#444' }}>2. Mediation Process</h2>
            <p>Jitume’s dedicated resolution team will mediate the dispute to ensure an impartial and fair outcome.</p>
            <ul style={{ margin: '10px 0 20px', paddingLeft: '20px' }}>
                <li>
                    <strong>Review of Submissions:</strong> The resolution team will analyze evidence and arguments provided by both parties.
                </li>
                <li>
                    <strong>Consultation:</strong> If needed, the team may request additional documentation or schedule a discussion with both parties.
                </li>
                <li>
                    <strong>Decision:</strong> After thorough review, the resolution team will issue a decision within 10 business days.
                </li>
            </ul>

            <h2 style={{ marginTop: '30px', fontSize: '20px', color: '#444' }}>3. Refunds & Compensation</h2>
            <p>Refunds or compensation will depend on the specific circumstances of the dispute and the terms of the agreement between the business and the investor.</p>
            <ul style={{ margin: '10px 0 20px', paddingLeft: '20px' }}>
                <li>
                    <strong>Eligible Refunds:</strong>
                    <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                        <li>If services are not delivered as agreed and the dispute is resolved in favor of the investor.</li>
                        <li>If funds held in escrow are unutilized due to non-performance by either party.</li>
                    </ul>
                </li>
                <li>
                    <strong>Partial Refunds:</strong>
                    <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                        <li>If partial work or milestones were completed, refunds may be prorated based on the completion level.</li>
                    </ul>
                </li>
                <li>
                    <strong>Non-Refundable Scenarios:</strong>
                    <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                        <li>If the dispute arises due to reasons beyond Jitume’s control, such as force majeure or mutual miscommunication not involving escrow funds.</li>
                    </ul>
                </li>
            </ul>

            <h2 style={{ marginTop: '30px', fontSize: '20px', color: '#444' }}>4. Escrow-Linked Disputes</h2>
            <p>Jitume’s escrow system ensures accountability for every transaction. Disputes related to escrow-managed funds will be resolved by determining whether the agreed milestones or deliverables have been met.</p>
            <ul style={{ margin: '10px 0 20px', paddingLeft: '20px' }}>
                <li>Release of funds to the appropriate party if milestones are verified.</li>
                <li>Refund to the investor if the business fails to deliver.</li>
                <li>Extended dispute window if additional clarification or action is needed.</li>
            </ul>

            <h2 style={{ marginTop: '30px', fontSize: '20px', color: '#444' }}>5. Prevention of Future Disputes</h2>
            <p>To minimize disputes, we recommend:</p>
            <ul style={{ margin: '10px 0 20px', paddingLeft: '20px' }}>
                <li>
                    <strong>Clear Agreements:</strong> Ensure all terms, deliverables, and milestones are clearly defined and agreed upon before commencing any project.
                </li>
                <li>
                    <strong>Regular Communication:</strong> Maintain open and transparent communication between parties to address concerns early.
                </li>
                <li>
                    <strong>Use of Project Tools:</strong> Leverage Jitume’s project management tools to document progress and feedback in real time.
                </li>
            </ul>

            <h2 style={{ marginTop: '30px', fontSize: '20px', color: '#444' }}>6. Contact Support</h2>
            <p>For further assistance, our support team is available to guide you through the process:</p>
            <ul style={{ margin: '10px 0 20px', paddingLeft: '20px' }}>
                <li>Email: support@jitume.com</li>
                <li>Live Chat: Available on your dashboard.</li>
            </ul>

            <p style={{ marginTop: '30px' }}>
                At Jitume, our goal is to facilitate successful partnerships while ensuring accountability and trust at every stage. Should any issues arise, rest assured that our dispute resolution process is designed to protect the interests of all parties involved.
            </p>
        </div>
    );
};

export default DisputeResolutionPolicy;