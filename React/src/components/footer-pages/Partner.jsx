import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const Partner = () => {

    useEffect(() => {
        // Simulate fetching data

    }, []);

    

    return (
        <div className="p-6 max-w-screen-xl mx-auto">
            <h1 className="text-4xl md:text-6xl mb-6 md:mb-10 font-bold leading-tight text-center font-sharp-grotesk text-[#00290F]">
                Partner with Us

            </h1>
 
            <div className="mb-6">
                <p>Welcome to Jitume! We believe in building a thriving ecosystem that bridges the gap between businesses and investors, fostering sustainable growth and innovation in local markets. If you're an investor looking to discover new opportunities or a service provider ready to support the next wave of businesses, we invite you to join us in empowering the entrepreneurial landscape.</p>

<p className="text-xl mt-3"><strong>Why Partner with Jitume?</strong></p>

<p><strong>Access to Promising businesses</strong><br></br>
Jitume offers you exclusive access to a curated selection of businesses tailored to your investment focus. Our platform’s vetting and support processes ensure that each listed startup is prepared, transparent, and committed to growth, making it easier for you to make informed investment decisions.</p>

<p><strong>Enhanced Transparency and Trust</strong><br></br>
We understand the importance of secure and trustworthy partnerships. Jitume’s escrow and project management tools ensure that every step of the investment journey is transparent and traceable, fostering a partnership built on mutual respect and accountability.</p>

<p><strong>Regional Insights and Custom Support</strong><br></br>
Jitume provides businesses with the unique, region-specific guidance they need to scale successfully. As a partner, you benefit from an understanding of local market dynamics and access to promising ventures poised to make a difference in these regions.</p>

<p><strong>Collaborative Funding and Service Delivery</strong><br></br>
Through structured funding phases and service delivery milestones, Jitume enables streamlined, collaborative engagements between investors and businesses, minimizing risk while maximizing the potential for positive returns and impactful results.</p>

<p><strong>Partner Opportunities</strong></p>
<ul>
  <li><strong>Investors:</strong> Explore vetted businesses aligned with your vision and secure your investments with Jitume’s transparent, phase-based funding model.</li>
  <li><strong>Service Providers:</strong> Offer your expertise to a network of ambitious businesses needing specialized support, from marketing to legal and financial advisory.</li>
  <li><strong>Mentors & Advisors:</strong> Share your experience and insights, helping businesses overcome challenges, grow sustainably, and prepare for successful funding rounds.</li>
</ul>

<p>Join us in creating a future where every entrepreneur with a vision has the resources and guidance they need to thrive. Together, let’s fuel innovation, empower local economies, and build successful partnerships.</p>

<p>Let’s connect and make impactful change happen.</p>

                
            </div>
          
        </div>
    );
};
export default Partner;
