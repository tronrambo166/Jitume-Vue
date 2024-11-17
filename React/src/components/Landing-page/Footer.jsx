import { useState } from 'react';
import { Link } from "react-router-dom";
import bannerImage from '../../images/bannerbg.png'; 
import rightImage from '../../images/bannerbg2.png'; 
import logo2 from '../../images/Mask group.png';
import logo from "../../images/logo.png";
import icon3 from "../../images/Icon 3.png";
import fb from "../../images/fb2.png";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import x from "../../images/x2.png";
import linkedin from "../../images/linkedin.png";
import down from '../../images/down.png'; // Include your dropdown arrow image
import FindBusinessBtn from './FindBusinessBtn';

const Footer = () => {
  const [openDropdown, setOpenDropdown] = useState(null); // State to track which dropdown is open

  // Toggle dropdown
  const handleDropdownToggle = (index) => {
    setOpenDropdown(openDropdown === index ? null : index); // Close if already open
  };

  return (
      <footer className="relative bg-[#00290F] mt-[70px] w-full">
          <div
              className="absolute -top-[100px] w-[90%] mt-[100px] left-1/2 transform -translate-x-1/2 banner py-2 h-[305px] rounded-lg shadow-lg flex flex-col md:flex-row items-center relative"
              style={{
                  backgroundImage: `url(${bannerImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
              }}
          >
              {/* Left Content */}
              <div className="w-full md:w-auto space-y-4 px-[20px] md:pl-[34px] flex flex-col items-center md:items-start pt-8 md:pt-0">
                  <div className="bg-yellow-400 w-[80px] md:w-[100px] rounded-full flex flex-col justify-center items-center px-4 md:px-6 py-2">
                      <img
                          src={logo2}
                          alt=""
                          className="w-[50px] h-auto md:w-[60px] md:h-[80%] max-h-[80px]"
                      />
                  </div>
                  <p className="text-center md:text-left text-[20px] md:text-[40px] text-white w-full md:w-[670px] leading-[28px] md:leading-[45px]">
                      Explore endless investment opportunities.
                  </p>
                  {/* <button className="px-6 md:px-8 py-3 md:py-4 font-semibold rounded-lg text-[#FFFFFF] text-[10px] md:text-[12px] hover:bg-green-600 bg-[#22C55E]">
                      Find a business
                  </button> */}
                  <FindBusinessBtn/>
              </div>

              {/* Right Image */}
              <img
                  src={rightImage}
                  alt="Right End"
                  className="hidden md:block absolute right-0 bottom-0 w-auto h-[305px]"
              />
          </div>

          <div className="mt-[20px] mx-auto px-[34px] text-white max-w-7xl">
              <div className="flex flex-wrap justify-between">
                  <div className="mt-8 flex flex-col space-y-6 w-full md:w-auto">
                      <h1 className="font-bold">Subscribe for latest update</h1>
                      <input
                          type="text"
                          placeholder="someone@domain.com"
                          className="w-full md:w-[350px] outline-white p-4 bg-white/10 h-[50px] rounded-xl"
                      />
                      <button className="text-white w-full md:w-[200px] px-3 py-2 rounded-lg bg-[#22C55E]">
                          Subscribe
                      </button>
                  </div>

                  {/* Links Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 md:mt-0">
                      {["Investors", "Business", "About Us"].map(
                          (title, index) => (
                              <div key={index}>
                                  <h3
                                      className="text-xl font-bold mb-5 flex items-center cursor-pointer"
                                      onClick={() =>
                                          handleDropdownToggle(index)
                                      }
                                  >
                                      {title}
                                      <img
                                          src={down}
                                          alt="Dropdown Icon"
                                          className={`ml-3 mt-[6px] h-2 w-3 transform transition-transform duration-200 ${
                                              openDropdown === index
                                                  ? "rotate-180"
                                                  : "rotate-0"
                                          } block lg:hidden`}
                                      />
                                  </h3>
                                  {/* Dropdown Links */}
                                  <ul
                                      className={`space-y-3 ${
                                          openDropdown === index
                                              ? "block"
                                              : "hidden"
                                      } md:block`}
                                  >
                                      {title === "Investors" && (
                                          <>
                                              {/* <li>Investment projects</li> */}
                                              {/* <li>Investor returns</li> */}
                                              <li><Link to={'/due-diligence'} > Due diligence charter </Link></li>
                                              <li><Link to={'/help-center'} > Help center </Link></li>
                                              <li><Link to={'/what-is-jitume'} > What is Jitume </Link></li>
                                              {/* <li>Funded community</li> */}
                                          </>
                                      )}
                                      {title === "Business" && (
                                          <>
                                              {/* <li>Seed investor</li> */}
                                              {/* <li>Early funding</li> */}
                                              {/* <li>Growth funding</li> */}
                                              {/* <li>Funded community</li> */}
                                              <li><Link to={'/knowledge-hub'} > Knowledge hub </Link></li>
                                              <li><Link to={'/refer-a-business'} > Refer a business </Link></li>
                                          </>
                                      )}
                                      {title === "About Us" && (
                                          <>
                                        <li>
                                        <Link to={'/careers'} > Careers </Link>
                                        </li>
                                              
                                              <li><Link to={'/partner-with-jitume'} > Partner with us </Link></li>
                                              {/* <li>News</li> */}
                                              {/* <li>Press</li> */}
                                          </>
                                      )}
                                  </ul>
                              </div>
                          )
                      )}
                  </div>
              </div>

              {/* Footer Bottom Section */}
              <div className="py-7 flex flex-col md:flex-row justify-between items-center">
                  <img src={logo} width={110} alt="logo" />
                  <div className="flex space-x-4 mt-6 md:mt-0">
                      <a
                          href="https://facebook.com"
                          target="_blank"
                          rel="noopener noreferrer"
                      >
                          <img
                              src={fb}
                              width={45}
                              height={30}
                              alt="custom icon"
                              className="object-contain"
                          />
                      </a>
                      <a
                          href="https://x.com"
                          target="_blank"
                          rel="noopener noreferrer"
                      >
                          <img
                              src={x}
                              width={45}
                              height={30}
                              alt="x logo"
                              className="object-contain"
                          />
                      </a>
                      <a
                          href="https://instagram.com"
                          className="bg-white/10 p-2 rounded-full"
                          target="_blank"
                          rel="noopener noreferrer"
                      >
                          <FaInstagram size={30} className="text-white" />
                      </a>
                      <a
                          href="https://linkedin.com"
                          target="_blank"
                          rel="noopener noreferrer"
                      >
                          <img
                              src={linkedin}
                              width={44}
                              height={30}
                              alt="custom icon"
                              className="object-contain"
                          />
                      </a>
                      {/* <a
                          href="https://linkedin.com"
                          target="_blank"
                          rel="noopener noreferrer"
                      >
                          <div className="bg-white/10 px-[9px] py-[14px] rounded-full">
                              <img
                                  src={icon3}
                                  width={30}
                                  height={30}
                                  alt="custom icon"
                                  className="object-contain"
                              />
                          </div>
                      </a> */}
                  </div>
              </div>
          </div>
      </footer>
  );
};

export default Footer;
