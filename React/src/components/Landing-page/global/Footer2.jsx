import { useState } from "react";
import logo from "../../../images/logo.png";
import fb from "../../../images/fb2.png";
import { FaInstagram } from "react-icons/fa";
import x from "../../../images/x2.png";
import linkedin from "../../../images/linkedin.png";
import down from "../../../images/down.png"; // Include your dropdown arrow image
import { Link } from "react-router-dom";

const Footer2 = () => {
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleDropdownToggle = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    return (
        <footer className="relative bg-[#00290F] mt-[70px] w-full">
            <div className="mt-[20px] py-[40px] mx-auto px-[34px] text-white max-w-7xl">
                <div className="flex flex-wrap justify-between">
                    <div className="mt-8 flex flex-col space-y-6 w-full md:w-auto">
                        <h1 className="font-bold">
                            Subscribe for latest update
                        </h1>
                        <input
                            type="text"
                            placeholder="someone@domain.com"
                            className="w-full md:w-[350px] outline-white p-4 bg-white/10 h-[50px] rounded-xl"
                        />
                        <button className="text-white w-full md:w-[200px] px-3 py-2 rounded-lg bg-[#22C55E]">
                            Subscribe
                        </button>
                    </div>

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
                                                <li>
                                                    <Link to={"/due-diligence"}>
                                                        Due diligence charter
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={"/help-center"}>
                                                        Help center
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to={"/what-is-jitume"}
                                                    >
                                                        What is Jitume
                                                    </Link>
                                                </li>
                                                {/* <li>Funded community</li> */}
                                            </>
                                        )}
                                        {title === "Business" && (
                                            <>
                                                {/* <li>Seed investor</li> */}
                                                {/* <li>Early funding</li> */}
                                                {/* <li>Growth funding</li> */}
                                                {/* <li>Funded community</li> */}
                                                <li>
                                                    <Link to={"/knowledge-hub"}>
                                                        Knowledge hub
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to={"/refer-a-business"}
                                                    >
                                                        Refer a business
                                                    </Link>
                                                </li>
                                            </>
                                        )}
                                        {title === "About Us" && (
                                            <>
                                                <li>
                                                    <Link to={"/careers"}>
                                                        Careers
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to={
                                                            "/partner-with-jitume"
                                                        }
                                                    >
                                                        Partner with us
                                                    </Link>
                                                </li>
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
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer2;
