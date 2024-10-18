import React from "react";
import e1 from "../../assets/E1.png";
import e2 from "../../assets/E2.png";
import e3 from "../../assets/E3.png";
import e4 from "../../assets/E4.png";
import e5 from "../../assets/E5.png";
import e6 from "../../assets/E6.png";
import e7 from "../../assets/E7.png";
import e8 from "../../assets/E8.png";
import e9 from "../../assets/E9.png";
import e10 from "../../assets/E10.png";

const categories = [
  { name: "Real Estate", count: 41, color: "bg-blue-50", icon: e1 },
  { name: "Education", count: 7, color: "bg-[#F3F8FE]", icon: e2 },
  { name: "Real Estate", count: 41, color: "bg-red-50", icon: e3 },
  { name: "Real Estate", count: 41, color: "bg-gray-100", icon: e4 },
  { name: "Real Estate", count: 41, color: "bg-yellow-50", icon: e5 },
  { name: "Lore Ipsum", count: 41, color: "bg-gray-100", icon: e6 },
  { name: "Real Estate", count: 41, color: "bg-red-50", icon: e7 },
  { name: "Real Estate", count: 41, color: "bg-yellow-50", icon: e8 },
  { name: "Real Estate", count: 41, color: "bg-blue-50", icon: e9 },
  { name: "Real Estate", count: 41, color: "bg-purple-50", icon: e10 },
  { name: "Real Estate", count: 41, color: "bg-gray-100", icon: e1 },
  { name: "Real Estate", count: 41, color: "bg-red-50", icon: e2 },
];

const Explore = () => {
  return (
    <div className="flex flex-col items-center py-8 sm:py-12 mb-20 ">
      <div className="mb-2 sm:mb-0">
        <span className="text-black bg-yellow-400 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm mb-2 sm:mb-4 inline-block">
          • Business categories
        </span>
      </div>
      <h1 className="font-sharp-grotesk text-[24px] sm:text-[36px] md:text-[44px] font-semibold leading-[32px] sm:leading-[46px] md:leading-[55.88px] tracking-[0.02em] text-slate-700 text-center mb-4 sm:mb-10">
        Exploring the latest categories<br></br> of business trends
      </h1>
      <div className="grid mx-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-5 mb-6 px-2 sm:px-4 md:px-0">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`flex items-center p-4 rounded-md  ${category.color}`}
          >
            <img
              src={category.icon}
              alt={category.name}
              className="w-5 h-5 sm:w-7 sm:h-7 mr-2 sm:mr-3"
            />
            <div className="flex items-center space-x-1 sm:space-x-2">
              <h2 className="text-xs sm:text-sm md:text-md font-medium">
                {category.name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                ({category.count})
              </p>
            </div>
          </div>
        ))}
      </div>
      <button className="px-4 sm:px-6 py-2 bg-green-800 hover:bg-green-700  text-white rounded-xl text-sm sm:mt-9 sm:text-lg shadow-lg hover:opacity-80 transition-opacity duration-300">
        Explore 30+ Businesses
      </button>
    </div>
  );
}
export default Explore;
