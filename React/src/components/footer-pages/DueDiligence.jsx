import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const DueDiligence = () => {

    useEffect(() => {
        // Simulate fetching data

    }, []);
const headingStyle1 = { fontSize: '28px', marginBottom: '16px' };
  const headingStyle2 = { fontSize: '24px', marginBottom: '12px' };
  const paragraphStyle = { marginBottom: '12px' };
  const listStyle = { marginLeft: '20px', marginBottom: '12px' };
  const listItemStyle = { marginBottom: '8px' };

    

    return (
        <div className="p-6 max-w-screen-xl mx-auto">
            <h1 className="text-4xl md:text-6xl mb-6 md:mb-10 font-bold leading-tight text-center font-sharp-grotesk text-[#00290F]">
                Due Diligence Charter for Jitume


            </h1>
 
            <div className="mb-6">
            
      <h1 style={headingStyle1}>Overview</h1>
      <p style={paragraphStyle}>Jitume is a platform connecting businesses with investors by offering secure, transparent, and milestone-based project management. The platform is committed to ensuring accountability, regulatory compliance, and a secure environment for both businesses and investors. This charter outlines the due diligence measures Jitume undertakes to ensure a safe, compliant, and efficient service environment.</p>

      <h2 style={headingStyle2}>1. Identity Verification and Compliance</h2>
      <ul style={listStyle}>
        <li style={listItemStyle}><strong>Objective:</strong> Ensure all users are authenticated to prevent fraudulent activity and enhance trust between businesses and investors.</li>
        <li style={listItemStyle}><strong>Process:</strong>
          <ul>
            <li style={listItemStyle}>Collection of government-issued IDs and PINs during user registration.</li>
            <li style={listItemStyle}>Verification of documents through a secure, encrypted process.</li>
            <li style={listItemStyle}>Cross-referencing with legal and governmental databases where applicable, ensuring that users comply with local and international regulatory standards.</li>
            <li style={listItemStyle}>Continuous monitoring and re-verification for long-term platform users.</li>
          </ul>
        </li>
        <li style={listItemStyle}><strong>Data Security:</strong> All collected personal data will be encrypted, stored securely, and only accessible to authorized personnel to maintain user privacy and data protection in accordance with relevant data protection laws.</li>
      </ul>

      <h2 style={headingStyle2}>2. Project Management and Milestone Structure</h2>
      <ul style={listStyle}>
        <li style={listItemStyle}><strong>Objective:</strong> Structure projects with milestones to monitor progress, manage expectations, and enhance accountability for both parties.</li>
        <li style={listItemStyle}><strong>Process:</strong>
          <ul>
            <li style={listItemStyle}>Investment and service projects will be organized into clearly defined, measurable milestones.</li>
            <li style={listItemStyle}>Milestones will be established based on project goals, timelines, and key performance indicators (KPIs) agreed upon by both parties.</li>
            <li style={listItemStyle}>Regular progress reports will be generated at each milestone to assess project health and compliance.</li>
            <li style={listItemStyle}>Adjustments to project scopes, if necessary, will be documented and agreed upon by both parties to maintain transparency.</li>
          </ul>
        </li>
        <li style={listItemStyle}><strong>Milestone Compliance:</strong> Jitume will facilitate milestone evaluations to ensure projects are on track, delivering a clear framework for investor and startup engagement and satisfaction.</li>
      </ul>

      <h2 style={headingStyle2}>3. Optional Third-Party Project Managers</h2>
      <ul style={listStyle}>
        <li style={listItemStyle}><strong>Objective:</strong> Enhance project efficiency and transparency through optional third-party oversight.</li>
        <li style={listItemStyle}><strong>Process:</strong>
          <ul>
            <li style={listItemStyle}>Both investors and businesses can opt to include third-party project managers to supervise project progress.</li>
            <li style={listItemStyle}>Third-party managers will provide independent assessments at each milestone, ensuring an unbiased evaluation of deliverables and adherence to timelines.</li>
            <li style={listItemStyle}>Jitume will maintain a network of qualified project managers available for selection based on project requirements and user preferences.</li>
          </ul>
        </li>
        <li style={listItemStyle}><strong>Transparency Assurance:</strong> Third-party managers will be held to high standards of integrity, and their involvement will be limited to reporting on the project’s alignment with agreed objectives, ensuring neutrality.</li>
      </ul>

      <h2 style={headingStyle2}>4. Funds Escrow System for Secure Transactions</h2>
      <ul style={listStyle}>
        <li style={listItemStyle}><strong>Objective:</strong> Protect investor funds and enhance payment security through an escrow system.</li>
        <li style={listItemStyle}><strong>Process:</strong>
          <ul>
            <li style={listItemStyle}>All investment funds will be placed in a secure escrow account before the commencement of a project.</li>
            <li style={listItemStyle}>Disbursement of funds will occur incrementally, aligned with the successful completion and approval of each milestone.</li>
            <li style={listItemStyle}>Both parties must consent to each milestone’s completion before funds are released, ensuring mutual agreement and satisfaction.</li>
            <li style={listItemStyle}>In case of disputes, funds will be held in escrow until a resolution is reached, ensuring no premature disbursement.</li>
          </ul>
        </li>
        <li style={listItemStyle}><strong>Financial Security Compliance:</strong> The escrow system is designed to align with relevant financial regulations and includes secure, encrypted handling of all financial transactions.</li>
      </ul>

      <h2 style={headingStyle2}>5. Data Privacy and Confidentiality</h2>
      <ul style={listStyle}>
        <li style={listItemStyle}><strong>Objective:</strong> Safeguard user data, maintain confidentiality, and uphold trust on the platform.</li>
        <li style={listItemStyle}><strong>Process:</strong>
          <ul>
            <li style={listItemStyle}>All user data is handled in compliance with the applicable data protection regulations, including GDPR and other relevant local data privacy laws.</li>
            <li style={listItemStyle}>Data access is restricted to authorized personnel, and all data is encrypted in transit and at rest.</li>
            <li style={listItemStyle}>Users are provided with transparency in how their data is collected, stored, and used, ensuring informed consent.</li>
          </ul>
        </li>
        <li style={listItemStyle}><strong>Security Audits:</strong> Jitume will perform regular security audits and assessments to maintain high standards of data protection and system security.</li>
      </ul>

      <h2 style={headingStyle2}>6. Monitoring and Reporting</h2>
      <ul style={listStyle}>
        <li style={listItemStyle}><strong>Objective:</strong> Ensure ongoing compliance and address issues promptly for continuous improvement.</li>
        <li style={listItemStyle}><strong>Process:</strong>
          <ul>
            <li style={listItemStyle}>Jitume will conduct regular audits of all projects and financial transactions.</li>
            <li style={listItemStyle}>A feedback mechanism will be available for users to report any irregularities or concerns.</li>
            <li style={listItemStyle}>A dedicated compliance team will oversee the platform’s adherence to this charter and provide periodic updates to stakeholders.</li>
          </ul>
        </li>
      </ul>

      <h1 style={headingStyle1}>Conclusion</h1>
      <p style={paragraphStyle}>This Due Diligence Charter formalizes Jitume’s commitment to secure, compliant, and transparent operations, fostering an environment of trust and accountability for both investors and businesses. Through these measures, Jitume aims to empower the growth and success of businesses while protecting investors' interests.</p>
                
            </div>
          
        </div>
    );
};
export default DueDiligence;
