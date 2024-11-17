import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const ReferAbusiness = () => {

    useEffect(() => {
        // Simulate fetching data

    }, []);

    

    return (
        <div className="p-6 max-w-screen-xl mx-auto">
            <h1 className="text-4xl md:text-6xl mb-6 md:mb-10 font-bold leading-tight text-center font-sharp-grotesk text-[#00290F]">
                Refer a Business to Jitume

            </h1>
 
            <div className="mb-6">
                <p > 
Do you know a business that could benefit from connecting with investors and preparing for funding opportunities? At Jitume, we’re dedicated to empowering businesses with the insights, services, and tools they need to attract investment and drive growth. By referring a business to Jitume, you’re helping them unlock new opportunities and secure the support needed to thrive in their local market.

            <h2 className="text-xl mt-3"><b>Why Refer a Business to Jitume?</b></h2>
            <b>1.Tailored Insights for Success:</b> Jitume provides businesses with specialized insights and services aligned with their unique regional needs, helping them become investment-ready.
            <br></br> <b>2.Trusted Investor Connections:</b> With Jitume, businesses gain exposure to a network of investors who are actively looking for promising ventures, ensuring a secure and transparent environment for both parties.
            <br></br> <b>3.Phased Escrow System:</b> Our robust escrow system manages funding and service delivery in structured phases, guaranteeing accountability and measurable progress at every stage.
            <br></br> <b>4.Efficient Project Management:</b> Through Jitume’s integrated project management tools, businesses and investors benefit from seamless collaboration, tracking performance and outcomes in real-time.
                    
            <h2 className="text-xl mt-3"><b>How to Refer a Business</b></h2>
            It’s simple to refer a business to Jitume:


            <br></br><b>1.</b> Send the details of the business to referrals@jitume.com

            <br></br><b>2.</b> Our team will review the referral and reach out to the business to explore how Jitume can support their goals.

            <br></br><b>3.</b> If the business joins Jitume, you could be eligible for referral rewards as a thank-you for supporting our mission!


                    
            <h2 className="text-xl mt-3"><b>Get Started</b></h2>

Help a business grow and succeed by connecting them with Jitume’s powerful platform. Simply fill out the form, and we’ll handle the rest. Together, let’s build a community of empowered, investment-ready businesses.
<br></br><br></br>Thank you for being part of the Jitume mission!

</p>
                
            </div>
          
        </div>
    );
};
export default ReferAbusiness;
