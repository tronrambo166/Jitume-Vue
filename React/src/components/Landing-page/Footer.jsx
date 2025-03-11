import { useState } from "react";
import { Link } from "react-router-dom";
import bannerImage from "../../images/bannerbg.png";
import rightImage from "../../images/bannerbg2.png";
import logo2 from "../../images/Tujitumelogo.svg";
import logo from "../../images/TujitumeLogo-white.svg";
import icon3 from "../../images/Icon 3.png";
// import fb from "../../images/fb2.png";
// import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import x from "../../images/x2.png";
// import linkedin from "../../images/linkedin.png";
import down from "../../images/down.png"; // Include your dropdown arrow image
import FindBusinessBtn from "./FindBusinessBtn";
import axiosClient from "../../axiosClient";
import { useAlert } from "../../components/partials/AlertContext";
import bannerbg from "../../images/bannerbg.png";
import {
    FaFacebookF,
    // FaXTwitter,
    FaInstagram,
    FaLinkedinIn,
} from "react-icons/fa";
const Footer = () => {
    const [openDropdown, setOpenDropdown] = useState(null); // State to track which dropdown is open
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert
    // Toggle dropdown
    const handleDropdownToggle = (index) => {
        setOpenDropdown(openDropdown === index ? null : index); // Close if already open
    };

    const [email, setEmail] = useState("");
    const handleEmail = (e) => {
        setEmail(e.target.value);
    };
document.addEventListener("DOMContentLoaded", () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    lazyImages.forEach((img) => {
        img.addEventListener("load", () => {
            img.classList.add("loaded");
        });
    });
});

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email == "" || email == null) {
            showAlert("error", "Please enter your email!");
            return;
        }

        const { data } = await axiosClient.get(
            "/JitumeSubscribeEmail/" + email
        );
        console.log(data);
        if (data.status == 200) showAlert("success", data.message);
        else showAlert("error", "Something went wrong!");
    };
    const isServiceRoute = location.pathname.includes("service");

    return (
        <footer className="relative bg-[#00290F] mt-[70px] w-full">
            <div
                className="absolute -top-[100px] w-[90%] mt-[100px] left-1/2 transform -translate-x-1/2 banner py-2 h-[305px] rounded-lg shadow-lg flex flex-col md:flex-row items-center relative"
                style={{
                    backgroundImage: `url(${bannerbg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Left Content */}
                <div className="w-full md:w-auto space-y-4 px-[20px] md:pl-[34px] flex flex-col items-center md:items-start pt-8 md:pt-0">
                    <div className="bg-yellow-400 rounded-full flex flex-col justify-center items-center px-4 md:px-6 py-2">
                        <img
                            src={logo2}
                            alt=""
                            className="w-[80px] h-auto md:w-[90px] md:h-[100%] max-h-[120px]"
                        />
                    </div>

                    <p className="text-center md:text-left text-[20px] md:text-[40px] text-white w-full md:w-[670px] leading-[28px] md:leading-[45px]">
                        {isServiceRoute ? (
                            <>
                                Explore endless business <br />
                                services
                            </>
                        ) : (
                            "Explore endless investment opportunities"
                        )}
                    </p>

                    {/* <button className="px-6 md:px-8 py-3 md:py-4 font-semibold rounded-lg text-[#FFFFFF] text-[10px] md:text-[12px] hover:bg-green-600 bg-[#22C55E]">
                      Find a business
                  </button> */}
                    <FindBusinessBtn />
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
                    <div className=" flex flex-col space-y-6 w-full md:w-auto">
                        <h1 className="text-white font-bold text-lg">
                            Subscribe for latest updates
                        </h1>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col space-y-4"
                        >
                            <input
                                type="email"
                                onChange={handleEmail}
                                placeholder="example@gmail.com"
                                className="w-full md:w-[350px] p-4 bg-[#1A3A27] text-white placeholder-white/70 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button
                                type="submit"
                                className="w-full md:w-[200px] py-3 bg-[#22C55E] text-white font-semibold rounded-lg hover:bg-green-600 transition"
                            >
                                Subscribe
                            </button>
                        </form>
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
                                            loading="lazy"
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
                                                <li>
                                                    <Link
                                                        target="_blank"
                                                        to={"/due-diligence"}
                                                    >
                                                        {" "}
                                                        Due diligence charter{" "}
                                                    </Link>
                                                </li>

                                                {/* <li>Funded community</li> */}
                                            </>
                                        )}
                                        {title === "Business" && (
                                            <>
                                                <li>
                                                    <Link
                                                        target="_blank"
                                                        to={"/knowledge-hub"}
                                                    >
                                                        Knowledge hub
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        target="_blank"
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
                                                    <Link
                                                        target="_blank"
                                                        to={"/tutorials"}
                                                    >
                                                        Tutorials
                                                    </Link>
                                                </li>

                                                <li>
                                                    <Link
                                                        target="_blank"
                                                        to={"/help-center"}
                                                    >
                                                        {" "}
                                                        Help center{" "}
                                                    </Link>
                                                </li>

                                                <li>
                                                    <Link
                                                        target="_blank"
                                                        to={
                                                            "/Resolution-center"
                                                        }
                                                    >
                                                        {" "}
                                                        Dispute & Resolution
                                                        Policy{" "}
                                                    </Link>
                                                </li>

                                                <li>
                                                    <Link
                                                        target="_blank"
                                                        to={"/what-is-jitume"}
                                                    >
                                                        {" "}
                                                        What is Tujitume{" "}
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        target="_blank"
                                                        to={"/careers"}
                                                    >
                                                        {" "}
                                                        Careers{" "}
                                                    </Link>
                                                </li>

                                                <li>
                                                    <Link
                                                        target="_blank"
                                                        to={
                                                            "/partner-with-jitume"
                                                        }
                                                    >
                                                        {" "}
                                                        Partner with us{" "}
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

                {/* Footer Bottom Section */}
                <div className="py-7 flex flex-col md:flex-row justify-between items-center">
                    <img
                        src={logo}
                        width={140}
                        alt="logo"
                        className="hover:opacity-75 transition-opacity cursor-pointer"
                        onClick={() => window.scrollTo(0, 0)}
                        loading="lazy"
                    />

                    <div className="flex space-x-4 mt-6 md:mt-0">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/10 p-3 rounded-full flex items-center justify-center"
                        >
                            <FaFacebookF size={24} className="text-white" />
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
                                loading="lazy"
                            />
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/10 p-3 rounded-full flex items-center justify-center"
                        >
                            <FaInstagram size={24} className="text-white" />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/10 p-3 rounded-full flex items-center justify-center"
                        >
                            <FaLinkedinIn size={24} className="text-white" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
