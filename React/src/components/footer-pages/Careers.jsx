import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const Careers = () => {

    useEffect(() => {
        // Simulate fetching data

    }, []);

    

    return (
        <div className="p-6 max-w-screen-xl mx-auto">
            <h1 className="text-4xl md:text-6xl mb-6 md:mb-10 font-bold leading-tight text-center font-sharp-grotesk text-[#00290F]">
                Careers at Tujitume
            </h1>
 
            <div className="mb-6">
                <p > 
                    Welcome to Tujitume’s Careers page! We are a passionate, forward-thinking team dedicated to helping businesses grow and thrive by connecting them with the right investors and resources for success. If you are excited by the prospect of working in a dynamic environment that supports innovation, transparency, and impact-driven solutions, Tujitume could be the perfect place for you.

                    <h2 className="text-xl mt-3"><b>Who We Are</b></h2>
                    Tujitume is more than just a web application. We’re a platform designed to empower businesses and investors alike by facilitating meaningful connections and providing vital support for investment readiness in regional markets. Our mission is to bridge the gap between businesses and investors, offering a secure, trusted environment that encourages growth and mutual success.
                    <h2 className="text-xl mt-3"><b>Our Approach</b></h2>

                    At Tujitume, we prioritize transparency and accountability. Our platform features an integrated escrow system that guarantees secure, phased funding and service delivery. We provide users with tailored insights and robust project management tools, promoting clarity and efficiency in every transaction. By joining Tujitume, you become part of a solution-oriented team focused on fostering sustainable, thriving business partnerships.
                    <h2 className="text-xl mt-3"><b>Why Join Us?</b></h2>
                    <b>*</b> Innovative Environment: Work at the intersection of technology and finance, creating solutions that empower businesses in emerging markets.
                    <br></br><b>*</b> Growth Opportunities: Take advantage of our commitment to professional development with opportunities for growth within our expanding team.
                    <br></br><b>*</b> Impact-Driven Work: Be a part of projects that drive real change for businesses and investors across diverse markets.
                    <br></br><b>*</b> Collaborative Culture: We believe in teamwork, open communication, and supporting each other to achieve our collective goals.
                    Current Openings
                    At Tujitume, we're always on the lookout for talented individuals who are ready to make a difference. If you’re interested in joining our team, please send your resume and a brief cover letter to careers@tujitume.com. We look forward to learning how you can contribute to our mission of empowering businesses for success.
                    <h2 className="text-xl mt-3"><b>Ready to Grow with Us?</b></h2>

                    If you're passionate about making an impact in the business and investment world, we encourage you to reach out. Join us on our journey to redefine how businesses connect with investors in emerging markets. Together, we can make a difference.

</p>
                
            </div>
          
        </div>
    );
};
export default Careers;
