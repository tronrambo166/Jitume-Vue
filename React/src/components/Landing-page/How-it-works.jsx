import { FaCircle } from "react-icons/fa";
import location from "../../images/location.jpeg";
import category from "../../images/category.jpeg";
import graph from "../../images/graph.jpeg";
import choose from "../../images/choose.jpeg";
import growth from "../../images/Growth.jpeg";

const HowItWorks = () => {
  const cards = [
    {
      title: "Enter Your Location",
      description: "Easily provide your current location to discover businesses near you. Our platform uses your location to offer the most relevant options in real-time.",
      icon: <img src={location} alt="Location Icon" className="w-full h-full object-cover rounded-full hover:animate-spin-slow" />, 
    },
    {
      title: "Choose a Category",
      description: "Select the business category that fits your needs. Whether agriculture, renewable energy or arts & culture.",
      icon:  <img src={category} alt="Category Icon" className="w-full h-full object-cover rounded-full hover:animate-spin-slow" />,
    },
    {
      title: "Get Tailored Results",
      description: "Receive customized business recommendations based on your location and chosen category. Filter through the most relevant and high-quality options.",
      icon:  <img src={graph} alt="Graph Icon" className="w-full h-full object-cover rounded-full hover:animate-spin-slow" />,
    },
    {
      title: "Select Your Business",
      description: "Browse through the top recommendations and choose the business that meets your exact requirements for quality and convenience.",
      icon:  <img src={choose} alt="Choose Icon" className="w-full h-full object-cover rounded-full hover:animate-spin-slow" />,
    },
    {
      title: "Grow Your Business",
      description: "Leverage our platform to grow your business visibility, increase foot traffic, and engage with local customers efficiently.",
      icon:  <img src={growth} alt="Growth Icon" className="w-full h-full object-cover rounded-full hover:animate-spin-slow" />,
    },
  ];

  return (
    <div className="w-full bg-[#F1F7FE] px-[34px] pt-[70px] aspect-[4/3] container mx-auto">
       <div className="flex justify-between items-center">
        <div>
        <div className="flex justify-center items-center gap-1 px-6 py-2 bg-[#F8D849] rounded-full max-w-[150px] whitespace-nowrap overflow-hidden">
  <FaCircle className="text-[6px]" />
  <h1 className="text-[16px]">How It Works</h1>
</div>

          <h1 className="text-[#334155] font-semibold leading-[70px] text-[50px] max-h-[8em] mx-auto">
            Discover How It All Works<br /> With Simple Steps
          </h1>
        </div>
        <p className="mt-4 leading-[1.6] text-[#334155] text-[18px] font-light w-[450px] pt-2 max-h-[8.2em] overflow-hidden">
          Explore the seamless process that connects you with nearby businesses. Whether you're searching for services or looking to grow your own, our platform simplifies the experience with easy steps and personalized results.
        </p>
      </div>
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-[120px] text-[#1E293B]">
        {cards.map((card, index) => (
          <div key={index} className="relative bg-white h-[240px] rounded-lg p-6 flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <div className="absolute top-[-20px] left-[25px] w-[50px] h-[50px] bg-green-200 rounded-full flex items-center justify-center overflow-hidden">
              {card.icon} 
            </div>

            <h2 className="text-lg mt-10 font-semibold transition-colors duration-300 hover:text-green-600">
              {card.title}
            </h2>
            <p className="text-gray-600 text-[15px] py-3 transition-colors duration-300 hover:text-gray-800">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
