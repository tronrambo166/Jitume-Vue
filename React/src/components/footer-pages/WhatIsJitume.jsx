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
                What is Jitume?

            </h1>
 
            <div className="mb-6">
                <p > 
                   Jitume is a cutting-edge web application designed to bridge the gap between businesses and investors, providing a dynamic platform that prepares businesses for funding opportunities and enhances their market readiness. Whether you’re a business looking for investment or an investor searching for new opportunities, Jitume empowers both parties with the tools and resources needed to create successful partnerships.


                    <h2 className="text-xl mt-3"><b>Empowering Businesses</b></h2>
                    Jitume offers businesses tailored insights and services, customized to meet the unique needs of their regional markets. By using data-driven analytics and business development tools, Jitume helps businesses improve their investment readiness, making them more attractive to potential investors. The platform’s user-friendly interface simplifies the process of preparing for funding, ensuring businesses can present themselves effectively and efficiently.

                    <h2 className="text-xl mt-3"><b>Connecting Investors</b></h2>

                    For investors, Jitume provides a secure and transparent platform to discover and evaluate businesses across various sectors. The system ensures that investors have access to critical business data, financial insights, and performance metrics, allowing them to make informed decisions with confidence. With an emphasis on trust and accountability, Jitume offers a safe environment for exploring high-potential investment opportunities.

                    <h2 className="text-xl mt-3"><b>Seamless Transactions & Structured Funding</b></h2>
                    At the heart of Jitume is its robust escrow system, which manages funding and service delivery in structured phases. This system ensures that both businesses and investors are protected, providing clear accountability and traceability throughout the process. With built-in project management tools, Jitume makes it easy to track milestones, monitor progress, and assess performance, ensuring that every transaction is smooth, transparent, and efficient.
                    Jitume is not just a platform; it's a powerful catalyst for growth, enabling businesses and investors to thrive together through mutual trust and strategic collaboration.


</p>
                
            </div>
          
        </div>
    );
};
export default Careers;
