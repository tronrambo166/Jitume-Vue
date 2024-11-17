import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const HelpCenter = () => {

    useEffect(() => {
        // Simulate fetching data

    }, []);

    

    return (
        <div className="p-6 max-w-screen-xl mx-auto">
            <h1 className="text-4xl md:text-6xl mb-6 md:mb-10 font-bold leading-tight text-center font-sharp-grotesk text-[#00290F]">
                Help Center for Investors

            </h1>
 
            <div className="mb-6">
                <p > 
Welcome to Jitume's Help Center for Investors! We are committed to making your investment journey on our platform as seamless, secure, and rewarding as possible. Here, you’ll find all the essential information you need to get started, manage your investments, and engage with the businesses seeking funding.

                    <h2 className="text-xl mt-3"><b>Getting Started with Jitume as an Investor
</b></h2>
                    Jitume is more than just a web application. We’re a platform designed to empower businesses and investors alike by facilitating meaningful connections and providing vital support for investment readiness in regional markets. Our mission is to bridge the gap between businesses and investors, offering a secure, trusted environment that encourages growth and mutual success.
                    <h2 className="text-xl mt-3"><b>Our Approach</b></h2>

                    At Jitume, we prioritize transparency and accountability. Our platform features an integrated escrow system that guarantees secure, phased funding and service delivery. We provide users with tailored insights and robust project management tools, promoting clarity and efficiency in every transaction. By joining Jitume, you become part of a solution-oriented team focused on fostering sustainable, thriving business partnerships.
                    
                    <h2 className="text-xl mt-3"><b>Why Join Us?</b></h2>
                    <b> 1. What is Jitume? </b> <br></br>
                    Jitume is an innovative platform that connects investors like you with businesses in need of funding. Our platform provides a secure and transparent way to explore, evaluate, and invest in businesses that are ready for growth within their local markets. We offer robust tools to manage funding transactions, monitor business performance, and ensure successful partnerships.
                    <br></br><b> 2. How does Jitume work? </b> <br></br>
                    Jitume’s system is designed to create a trusted environment for investors. We employ a phased escrow system that ensures funds are released in structured stages as project milestones are achieved. This phased approach protects your investment, providing accountability and transparency throughout the project lifecycle.
                    <br></br><b> 3. Why invest with Jitume? </b> <br></br>
                    Our platform gives you access to a curated selection of promising businesses, all vetted and supported with the tools and services necessary for growth. With detailed insights, project management tools, and a secure investment process, Jitume offers an environment where your investments can flourish in collaboration with local entrepreneurs.

                    <h2 className="text-xl mt-3"><b>Key Features for Investors</b></h2>
                    <b> 1. Secure Escrow System: </b> 
The Jitume escrow system manages all funding in stages, holding funds until specific milestones are met. This process safeguards your investment and ensures that the business delivers on its commitments, reducing risk and maximizing transparency.
                    <br></br><b> 2. Comprehensive Project Management: </b> 
Jitume offers powerful project management tools that let you track the progress of your investments in real-time. Access detailed insights on business performance and stay informed at each stage of the funding process.
                    <br></br><b> 3. Tailored Business Insights: </b> <br></br>
Jitume provides you with market-relevant insights and customized information for each investment opportunity. Our platform adapts to regional specifics, allowing you to make more informed decisions based on local market conditions.
                    
                    <h2 className="text-xl mt-3"><b>How to Evaluate Opportunities</b></h2>
                    <b> 1. Browse Opportunities: </b> 
                    Start by exploring businesses on the Jitume platform. Each business profile includes key information, project goals, funding requirements, and performance metrics.
                    <br></br><b> 2. Assess Risks and Milestones: </b> 
Review the phased milestones and potential risks for each project. Jitume’s transparent milestone system helps you evaluate a business’s readiness for funding.
                   <br></br> <b> 3. Due Diligence: </b> 
                   Take advantage of Jitume’s tailored insights to perform thorough due diligence on each business. Understand the business's goals, market needs, and strategic plans before committing.

<br></br>
                    
<h2 className="text-xl mt-3"><b>Making an Investment</b></h2>
                    <b> 1. Select a Business: </b> 
Once you've identified a promising business, follow the steps outlined in the business profile to begin the investment process.
                    <br></br><b> 2. Funding Process: </b> 
Funds are transferred securely through our escrow system and released in stages as the business meets key milestones.
                    <br></br><b> 3. Track Progress: </b> 
Use Jitume’s project management tools to monitor the performance of your investment. You’ll receive updates and performance reports, allowing you to track project outcomes and success rates.
                    
                    <h2 className="text-xl mt-3"><b>Account and Security</b></h2>

                    <b> * Setting Up Your Account: </b> 
Create a secure account with Jitume and set up two-factor authentication to safeguard your information.
                    <br></br><b> * Transaction Security: </b> 
 Jitume uses advanced encryption and security protocols to protect your transactions and personal data.
                    <br></br><b> * Escrow Management: </b> 
The Jitume escrow system ensures that your funds are managed with the utmost care, offering transparency and security at every stage of the investment

<h2 className="text-xl mt-3"><b>Frequently Asked Questions</b></h2>
                    <b> 1. Is there a minimum investment amount? </b> 
Jitume offers flexible investment options with minimum requirements that vary by project. Please check individual project profiles for specifics.
                    <br></br><b> 2. Can I withdraw my investment? </b> 
Investments are typically bound to the project milestones outlined in each agreement. Withdrawals may be limited depending on the stage of the project. Contact support for further assistance.
                   <br></br> <b> 3. How does Jitume handle unsuccessful projects?
 </b> 
In the event a business fails to meet agreed milestones, the escrow system holds back further funding, and we work with the business to provide corrective measures. Your investment is protected at each stage.


<h2 className="text-xl mt-3"><b>Support</b></h2>
                    Have questions or need assistance? Our support team is here to help. <Link ><b>Contact </b></Link> Support: Reach us at support@jitume.com for any inquiries or support needs.


</p>
                
            </div>
          
        </div>
    );
};
export default HelpCenter;
